const { authServices } = require("../services");
const { LOGOUT, PASSWORD_UPDATED } = require("../helpers/response.js");
const { asyncHandler } = require("../middlewares");

const register = asyncHandler(async (req, res, next) => {
  const { username, password, email, fullname } = req.body;

  const result = await authServices.register({
    username,
    password,
    email,
    fullname,
  });

  return res.status(201).json(result);
});

const login = asyncHandler(async (req, res, next) => {
  const { username, password, captchaResponse } = req.body;
  const result = await authServices.login(username, password, captchaResponse);
  return res.status(200).json(result);
});

const logout = asyncHandler(async (req, res, next) => {
  const { refresh_token } = req.body;
  await authServices.logout(refresh_token);
  return res.status(200).json(LOGOUT());
});

const refresh = asyncHandler(async (req, res, next) => {
  const { refresh_token } = req.body;
  const result = await authServices.refresh(refresh_token);
  return res.status(200).json(result);
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { old_password, new_password } = req.body;
  await authServices.resetPassword(
    req.user.user_id,
    old_password,
    new_password,
  );
  return res.status(201).json(PASSWORD_UPDATED());
});

module.exports = {
  register,
  login,
  logout,
  refresh,
  resetPassword,
};
