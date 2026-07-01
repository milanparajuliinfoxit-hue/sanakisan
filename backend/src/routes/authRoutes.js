const express = require("express");
const router = express.Router();
const { authValidation, auth } = require("../middlewares");
const { authControllers } = require("../controller");

router.route("/register").post(
  authValidation.validateRegister, // make sure this exists
  authControllers.register,
);

router
  .route("/login")
  .post(authValidation.validateLogin, authControllers.login);

router
  .route("/refresh")
  .post(authValidation.validateToken, authControllers.refresh);

router
  .route("/logout")
  .post(auth, authValidation.validateToken, authControllers.logout);

router
  .route("/resetpassword")
  .post(
    auth,
    authValidation.validateResetPassword,
    authControllers.resetPassword,
  );

module.exports = router;
