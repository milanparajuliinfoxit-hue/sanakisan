const jwtServices = require("./jwtServices");
const User = require("../../models/User");
const {
  CAPTCHA_SECRET_KEY,
  CAPTCHA,
  JWT_SECRET,
  REFRESH_SECRET,
  REFRESH_EXPIRY,
  JWT_EXPIRY,
} = require("../config/constant");
const CustomErrorHandler = require("../utils/CustomErrorHandler");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const RefreshToken = require("../../models/RefreshToken");

//register ashwin starting......
const register = async ({ username, password, email, fullname, user_type }) => {
  // check if user already exists
  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    return CustomErrorHandler.alreadyExists("Username already taken");
  }

  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) {
    return CustomErrorHandler.alreadyExist("Email already registered");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const user = await User.create({
    username,
    email,
    fullname,
    user_type: user_type || "user",
    password: hashedPassword,
  });

  // optional: generate tokens on register (common in modern apps)
  const payload = {
    user_id: user.id,
    username: user.username,
    email: user.email,
    fullname: user.fullname,
    user_type: user.user_type,
  };

  const access_token = jwtServices.generateToken(
    payload,
    JWT_SECRET,
    JWT_EXPIRY,
  );

  const refresh_token = jwtServices.generateToken(
    payload,
    REFRESH_SECRET,
    REFRESH_EXPIRY,
  );

  await RefreshToken.create({
    user_id: user.id,
    token: refresh_token,
  });

  return {
    userInfo: payload,
    access_token,
    refresh_token,
  };
};

//ending...........ashwin
const login = async (username, password, captchaResponse) => {
  //verify captcha response
  const captchaVerification = await verifyCaptchaResponse(captchaResponse);
  if (!captchaVerification) {
    return CustomErrorHandler.inValidCaptchaResponse();
  }

  //validate username and password
  const user = await User.findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return CustomErrorHandler.wrongCredentials();
  }

  //generate access token and refresh token
  const payload = {
    user_id: user.id,
    username,
    email: user.email,
    fullname: user.fullname,
    user_type: user.user_type,
  };
  const access_token = jwtServices.generateToken(
    payload,
    JWT_SECRET,
    JWT_EXPIRY,
  );
  const refresh_token = jwtServices.generateToken(
    payload,
    REFRESH_SECRET,
    REFRESH_EXPIRY,
  );

  //save refresh token in the database
  await RefreshToken.create({ user_id: user.id, token: refresh_token });

  return {
    userInfo: payload,
    access_token,
    refresh_token,
  };
};

const verifyCaptchaResponse = async (captchaResponse) => {
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${CAPTCHA_SECRET_KEY}&response=${captchaResponse}`;
  if (CAPTCHA == "true") {
    const response = await axios.post(url);
    return response.data.success;
  }
  return true;
};

const logout = async (refresh_token) => {
  const result = await RefreshToken.destroy({
    where: { token: refresh_token },
  });
  return result;
};

const refresh = async (refresh_token) => {
  const token = await RefreshToken.findOne({ where: { token: refresh_token } });
  if (token == null) return CustomErrorHandler.unAthorized();

  //verify the refresh token
  const { user_id, username, email, fullname, user_type } = jwtServices.verify(
    refresh_token,
    REFRESH_SECRET,
  );

  //check if user exists
  const user = await User.findOne({ where: { id: user_id } });
  if (user == null) return CustomErrorHandler.unAthorized("No user found");

  //generate new tokens
  let payload = { user_id, username, email, fullname, user_type };
  let new_access_token = jwtServices.generateToken(
    payload,
    JWT_SECRET,
    JWT_EXPIRY,
  );
  let new_refresh_token = jwtServices.generateToken(
    payload,
    REFRESH_SECRET,
    REFRESH_EXPIRY,
  );

  await RefreshToken.update(
    { token: new_refresh_token },
    {
      where: {
        [Op.and]: [{ token: refresh_token }, { user_id: user_id }],
      },
    },
  );

  return {
    userInfo: payload,
    access_token: new_access_token,
    refresh_token: new_refresh_token,
  };
};

const resetPassword = async (user_id, old_password, new_password) => {
  //validate old password
  const { dataValues } = await User.findByPk(user_id, {
    attributes: ["password"],
  });
  const isMatch = await bcrypt.compare(old_password, dataValues.password);
  if (!isMatch) {
    throw CustomErrorHandler.wrongCredentials("Invalid Password!!!");
  }

  //update new hashed password
  const hashedPassword = await bcrypt.hash(new_password, 10);
  await User.update({ password: hashedPassword }, { where: { id: user_id } });
  return;
};

module.exports = {
  register,
  login,
  logout,
  refresh,
  resetPassword,
};
