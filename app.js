const express = require("express");
const app = express();
const jobs = require("./routes/jobs.router");
const user = require("./routes/user.routes.js");
const auth = require("./routes/auth.router.js");
const cors = require("cors");
const { loginAuth } = require("./middlewares/auth.middleware.js");

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.use("/auth", auth);
app.use("/user", loginAuth, user);
app.use("/jobs", loginAuth, jobs);

app.use("*", (req, res, next) => {
  res.status(404).json({
    message: "Page not found",
  });
});

module.exports = app;
