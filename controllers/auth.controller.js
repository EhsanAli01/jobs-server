const { user } = require("../models");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const bcrypt = require("bcrypt");

const userSchema = joi.object({
  userType: joi.string().required(),
  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org", "edu", "gov"] },
    })
    .required(),
  userName: joi.string().min(5).max(10).required(),
  password: joi
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
    }),
  description: joi.string(),
  image: joi.string(),
});

const email = joi
  .string()
  .email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "org", "edu", "gov"] },
  })
  .required();

const resetPasswordSchema = joi.object({
  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org", "edu", "gov"] },
    })
    .required(),
  newPassword: joi
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
    }),
});

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
        userType: result.userType,
        userName: result.userName,
        email: result.email,
        description: result.description,
        image: result.image,
      },
      "abc?123",
      {
        expiresIn: "30d",
      }
    );
    return res.status(200).json({
      message: {
        userData: result,
        token: token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

const register = async (req, res, next) => {
  try {
    const { value: validatedData, error: dataError } = userSchema.validate(
      req.body
    );
    if (dataError) {
      return res.status(500).json({
        message: dataError.details[0].message,
      });
    }

    const hash = await bcrypt.hash(validatedData.password, 10);
    if (!hash) {
      return res.status(500).json({
        message: "Error in hashing password",
      });
    }

    const data = {
      userType: validatedData.userType,
      email: validatedData.email,
      userName: validatedData.userName,
      password: hash,
    };

    const result = await user.create(data);

    const token = jwt.sign(
      {
        id: result.id,
        userType: result.userType,
        userName: result.userName,
        email: result.email,
        description: result.description,
        image: result.image,
      },
      "abc?123",
      {
        expiresIn: "30d",
      }
    );

    return res.status(200).json({
      userData: result,
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error,
    });
  }
};

const checkEmail = async (req, res, next) => {
  try {
    const mail = req.body.email;
    const { value: validatedData, error: dataError } = email.validate(mail);
    if (dataError) {
      return res.status(500).json({
        message: dataError.details[0].message,
      });
    }

    const result = await user.findOne({
      where: {
        email: validatedData,
      },
    });

    if (!result) {
      return res.status(401).json({
        message: "Email Not Found",
      });
    }

    return res.status(200).json({
      message: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

const checkOtp = async (req, res, next) => {
  try {
    const otp = req.body.otp;
    const orgOtp = 1234;

    if (otp !== orgOtp) {
      return res.status(401).json({
        message: "Invalid OTP",
      });
    }

    res.status(200).json({
      message: "OTP successfully verified",
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
    const result = await user.update(
      {
        password: hash,
      },
      {
        where: {
          email: email,
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

module.exports = {
  login,
  register,
  checkEmail,
  checkOtp,
  passwordReset,
};
