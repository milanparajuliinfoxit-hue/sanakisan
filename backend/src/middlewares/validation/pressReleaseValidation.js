const Joi = require("joi");

const validatePressReleasePost = (req, res, next) => {
  const Schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    author: Joi.string().required(),
    publishStatus: Joi.string().required().valid("draft", "published"),
    publishDate: Joi.string().required(),
  });
  const { error } = Schema.validate(req.body);
  if (error) {
    return next(error);
  }
  next();
};

const validatePressReleaseUpdate = (req, rex, next) => {
  const Schema = Joi.object({
    id: Joi.number().required(),
    title: Joi.string().required(),
    content: Joi.string().required(),
    author: Joi.string().required(),
    publishStatus: Joi.string().required().valid("draft", "published"),
    publishDate: Joi.string().required(),
  });
  const { error } = Schema.validate(req.body);
  if (error) {
    return next(error);
  }
  next();
}

const validateDeletePressRelease = (req, res, next) => {

  const Schema = Joi.object({
    pressReleaseId: Joi.number().required(),
  });

  const { error } = Schema.validate(req.body);
  if (error) {
    return next(error);
  }
  next();
};

const validateGetPressRelease = (req, res, next) => {

  const Schema = Joi.object({
    pressReleaseId: Joi.number().required(),
  });

  const { error } = Schema.validate(req.query);
  if (error) {
    return next(error);
  }
  next();
};

const validatePaginationQuery = (req, res, next) => {
  const Schema = Joi.object({
    page: Joi.number().required(),
    limit: Joi.number().required(),
    publish_status: Joi.string()
      .required()
      .valid("draft", "published")
      .allow("", null),
    status: Joi.number().required().valid(0, 1),
  });

  const { error } = Schema.validate(req.query);
  if (error) {
    return next(error);
  }
  next();
};


module.exports = {
  validatePressReleasePost,
  validatePaginationQuery,
  validateDeletePressRelease,
  validatePressReleaseUpdate,
  validateGetPressRelease
};
