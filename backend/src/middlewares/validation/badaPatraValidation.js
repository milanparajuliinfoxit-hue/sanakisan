const Joi = require('joi');

const validateIdParam = (req, res, next) => {
  const schema = Joi.object({ id: Joi.number().integer().positive().required() });
  const { error } = schema.validate(req.params);
  if (error) return next(error);
  next();
};

module.exports = { validateIdParam };
