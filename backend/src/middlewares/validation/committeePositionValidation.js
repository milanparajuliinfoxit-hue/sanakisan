const Joi = require('joi');

const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return next(error);
  next();
};

const validateUpdate = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    status: Joi.number().valid(0, 1).optional(),
  });
  const { error } = schema.validate(req.body);
  if (error) return next(error);
  next();
};

module.exports = { validateCreate, validateUpdate };
