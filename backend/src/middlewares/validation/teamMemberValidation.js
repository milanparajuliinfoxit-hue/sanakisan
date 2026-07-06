
const Joi = require('joi');

const validateCreateTeamMember = async (req, res, next) => {

  const Schema = Joi.object({
    name: Joi.string().required(),
    committee_type_id: Joi.number().integer().required(),
    committee_position_id: Joi.number().integer().required(),
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
    committee_type_id: Joi.number().integer().optional().allow(null),
    committee_position_id: Joi.number().integer().optional().allow(null),
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