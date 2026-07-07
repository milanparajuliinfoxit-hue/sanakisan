const Joi = require('joi');

const validateCreate = (req, res, next) => {
  const schema = Joi.object({
    full_name: Joi.string().trim().min(3).max(150).required(),
    phone: Joi.string().trim().allow('').pattern(/^[+]?[\d\s\-()]{7,20}$/).optional(),
    email: Joi.string().trim().email().required(),
    message: Joi.string().trim().min(10).max(3000).required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = {};
    error.details.forEach(detail => {
      const key = detail.path[0];
      if (!errors[key]) errors[key] = [];
      errors[key].push(detail.message);
    });
    return res.status(400).json({ status: false, errors });
  }

  const stripHtml = (str) => str.replace(/<[^>]*>/g, '');
  req.body.full_name = stripHtml(req.body.full_name);
  req.body.message = stripHtml(req.body.message);
  if (req.body.phone) req.body.phone = stripHtml(req.body.phone);

  next();
};

const validateStatusUpdate = (req, res, next) => {
  const schema = Joi.object({
    status: Joi.string().valid('NEW', 'READ', 'REPLIED', 'ARCHIVED').required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ status: false, message: error.message });
  next();
};

const validateIdParam = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.number().integer().positive().required(),
  });

  const { error } = schema.validate(req.params);
  if (error) return res.status(400).json({ status: false, message: 'Invalid ID.' });
  next();
};

module.exports = { validateCreate, validateStatusUpdate, validateIdParam };
