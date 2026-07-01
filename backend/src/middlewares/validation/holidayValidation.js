const Joi = require("joi");

const validateHolidayPost = (req, res, next) => {
  const Schema = Joi.object({
    title: Joi.string().required(),
    holidayDate: Joi.string().required(),
  });

  const { error } = Schema.validate(req.body);

  if (error) {
    return next(error);
  }

  next();
};

module.exports = {
  validateHolidayPost,
};