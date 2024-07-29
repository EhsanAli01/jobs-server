const { user } = require("../models");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const bcrypt = require("bcrypt");
const generateOtp = require("../util/otpGenerator");
const sendMail = require("../util/sendMails");
const isWithinFiveMinutes = require("../util/otpTimeStamp");

// Schemas
const emailSchema = joi
  .string()
  .email({
    minDomainSegments: 2,
    tlds: { allow: ["com"] },
  })
  .required();

const passwordSchema = joi
  .string()
  .min(8)
  .max(30)
  .pattern(new RegExp("(?=.*[A-Z])"), "one uppercase letter.")
  .pattern(new RegExp("(?=.*[a-z])"), "one lowercase letter.")
  .pattern(new RegExp("(?=.*\\d)"), "one digit.")
  .pattern(new RegExp("(?=.*[@$!%*?&#])"), "one special character.")
  .required()
  .messages({
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password must be less than 30 characters long",
    "string.pattern.name": "Password must contain at least {#name}",
    "string.empty": "Password is required",
  });

const registerationSchema = joi.object({
  userType: joi.string().required(),
  email: emailSchema,
  userName: joi.string().min(5).max(10).required(),
  password: passwordSchema,
});

const resetPasswordSchema = joi.object({
  email: emailSchema,
  newPassword: passwordSchema,
});

// Register
const register = async (req, res, next) => {
  try {
    const { value: validatedData, error: dataError } =
      registerationSchema.validate(req.body);

    if (dataError) {
      return res.status(500).json({
        message: dataError.details[0].message,
      });
    }

    const { userType, userName, email, password } = validatedData;

    const result = await user.findOne({
      where: { email },
    });

    if (result) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);
    if (!hash) {
      return res.status(500).json({
        message: "Error in hashing password",
      });
    }

    const otp = generateOtp();
    const timestamp = Date.now();

    const newUser = await user.create({
      userType,
      userName,
      email,
      password: hash,
      otp,
      timestamp,
      status: "unverified",
    });

    await sendMail(email, otp);

    return res.status(200).json({
      message: "Otp Sent Successfully",
      messageSentTo: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error,
    });
  }
};

const verify = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const result = await user.findOne({
      where: { email },
    });

    const otpInTime = isWithinFiveMinutes(result.timestamp);

    if (otp === result.otp && otpInTime) {
      await user.update(
        {
          otp: null,
          timestamp: null,
          status: "verified",
        },
        { where: { email } }
      );

      const Refetch_data = await user.findOne({
        where: { email },
      });

      const token = jwt.sign(
        {
          id: Refetch_data.id,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "30d",
        }
      );

      return res.status(200).json({
        userData: Refetch_data,
        token: token,
      });
    } else {
      return res.status(401).json({
        message: "Invalid OTP",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error,
    });
  }
};

// Login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await user.findOne({
      where: { email: email },
    });

    if (!result) {
      return res.status(404).json({
        message: "Email Not Found",
      });
    }

    const compare = await bcrypt.compare(password, result.password);
    if (!compare) {
      return res.status(401).json({
        message: "Incorrect Password",
      });
    }

    const token = jwt.sign(
      {
        id: result.id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );
    return res.status(200).json({
      userData: result,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

// Reset Password
const checkEmail = async (req, res, next) => {
  try {
    const { value: validatedData, error: dataError } = emailSchema.validate(
      req.body.email
    );
    if (dataError) {
      return res.status(500).json({
        message: dataError.details[0].message,
      });
    }

    const email = validatedData;

    const result = await user.findOne({
      where: {
        email,
      },
    });

    if (!result) {
      return res.status(401).json({
        message: "Email Not Found",
      });
    }

    const otp = generateOtp();
    const timestamp = Date.now();

    await user.update({ timestamp, otp }, { where: { email } });

    await sendMail(validatedData, otp);

    return res.status(200).json({
      message: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

const passwordReset = async (req, res, next) => {
  try {
    const { value: validatedData, error: dataError } =
      resetPasswordSchema.validate(req.body);
    if (dataError) {
      return res.status(500).json({
        message: dataError.details[0].message,
      });
    }

    const { email, newPassword } = validatedData;

    const hash = await bcrypt.hash(newPassword, 10);
    await user.update(
      {
        password: hash,
      },
      {
        where: {
          email,
        },
      }
    );

    return res.status(200).json({
      message: "Password Reset Successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

// Utility

const sendOtp = async (req, res, next) => {
  try {
    const email = req.body.email;
    const otp = generateOtp();
    const timestamp = Date.now();

    await user.update({ timestamp, otp }, { where: { email } });

    await sendMail(email, otp);

    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

const checkOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const result = await user.findOne({
      where: { email },
    });

    const otpInTime = isWithinFiveMinutes(result.timestamp);

    if (otp === result.otp && otpInTime) {
      await user.update(
        {
          otp: null,
          timestamp: null,
          status: "verified",
        },
        { where: { email } }
      );

      res.status(200).json({
        message: "verified",
      });
    } else {
      return res.status(401).json({
        message: "Invalid OTP",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

module.exports = {
  register,
  verify,
  login,
  checkEmail,
  sendOtp,
  passwordReset,
  checkOtp,
};
