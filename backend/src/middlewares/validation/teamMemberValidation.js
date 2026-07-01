
const Joi = require('joi');

const validateCreateTeamMember = async (req, res, next) => {

  const Schema = Joi.object({
    // feature_image: Joi.string().required(),
    name: Joi.string().required(),
    position: Joi.string().optional().allow(null, ''),
    type: Joi.string().required(),
    email: Joi.string().email().optional().allow(null, ''),
    contact: Joi.string().optional().allow(null, ''),
    tenure: Joi.string().optional().allow(null, ''),
  });

  const { error } = Schema.validate(req.body);
  if (error) {
    return next(error);
  }
  next();
};

const validateUpdateTeamMember = async (req, res, next) => {
  const Schema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().optional().allow(null, ''),
    position: Joi.string().optional().allow(null, ''),
    type: Joi.string().optional().allow(null, ''),
    email: Joi.string().email().optional().allow(null, ''),
    contact: Joi.string().optional().allow(null, ''),
    tenure: Joi.string().optional().allow(null, ''),
  });

  const { error } = Schema.validate(req.body);
  if (error) {
    return next(error);
  }
  next();
}


const validateDeleteTeamMember = async (req, res, next) => {

  const Schema = Joi.object({    
    id: Joi.number().required(),
  });

  const { error } = Schema.validate(req.body);
  if (error) {
    return next(error);
  }
  next();
};

module.exports = {
  validateCreateTeamMember,
  validateDeleteTeamMember,
  validateUpdateTeamMember
};