const Joi = require("joi");
const { CAPTCHA } = require("../../config/constant");

//starting ashwin........
const validateRegister = async (req, res, next) => {
  const Schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),

    email: Joi.string().email().required(),

    fullname: Joi.string().min(3).max(100).required(),

    password: Joi.string()
      .min(8)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        "string.min": "Password must be at least 8 characters long",
        "any.required": "Password is required",
      }),

    user_type: Joi.string().valid("user", "admin").optional(),
  });

  const { error } = Schema.validate(req.body);
  if (error) {
    return next(error);
  }

  next();
};
//ending ashwin...........
const validateLogin = async (req, res, next) => {
  const Schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    ...(CAPTCHA == "true" && { captchaResponse: Joi.string().required() }),
  });

  const { error } = Schema.validate(req.body);
  if (error) {
    return next(error);
  }
  next();
};

const validateToken = async (req, res, next) => {
  const Schema = Joi.object({
    refresh_token: Joi.string().required(),
  });

  const { error } = Schema.validate(req.body);
  if (error) {
    return next(error);
  }
  next();
};

const validateResetPassword = (req, res, next) => {
  const Schema = Joi.object({
    old_password: Joi.string().required(),
    new_password: Joi.string()
      .min(8)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        "string.min": "Password must be at least 8 characters long",
        "any.required": "Password is required",
      }),
  });

  const { error } = Schema.validate(req.body);
  if (error) {
    return next(error);
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateToken,
  validateResetPassword,
};
