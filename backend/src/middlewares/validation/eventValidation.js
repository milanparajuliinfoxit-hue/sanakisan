const Joi = require("joi");

const validateEventPost = (req, res, next) => {
  const Schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    author: Joi.string().required(),
    featuredImage: Joi.string().allow(null, ""),
    publishStatus: Joi.string().required().valid("draft", "published"),
    event_date: Joi.string().required(),
  });
  const { error } = Schema.validate(req.body);
  if (error) {
    return next(error);
  }
  next();
};

const validatePaginationQuery = (req, res, next) => {
  const Schema = Joi.object({
    page: Joi.number().required(),
    limit: Joi.number().required(),
    publishStatus: Joi.string()
      .required()
      .valid("draft", "published")
      .allow(""),
    status: Joi.number().required().valid(0, 1),
  });  

  const { error } = Schema.validate(req.query);
  if (error) {
    return next(error);
  }
  next();
};

const validateUpdateEvent = async (req, res, next) => {
  const Schema = Joi.object({
    id: Joi.number().required(),
    title: Joi.string().required(),
    content: Joi.string().required(),
    author: Joi.string().required(),
    featuredImage: Joi.string().allow(null, ""),
    publishStatus: Joi.string().required().valid("draft", "published"),
    event_date: Joi.string().required(),
  });

  const { error } = Schema.validate(req.body);
  if (error) {
    return next(error);
  }
  next();
}


const validateDeleteEvent = async (req, res, next) => {

  const Schema = Joi.object({    
    eventId: Joi.number().required(),
  });

  const { error } = Schema.validate(req.body);
  if (error) {
    return next(error);
  }
  next();
};

const validatePublishStatus = (req, res, next) => {
  const Schema = Joi.object({
    blog_id: Joi.number().required(),
    publish_status: Joi.string().required().valid("draft", "published"),
  });

  const { error } = Schema.validate(req.body);
  if (error) {
    return next(error);
  }
  next();
};

const validateUpdateBlogPost = (req, res, next) => {
  const Schema = Joi.object({
    id: Joi.number().required(),
    title: Joi.string().required(),
    featured_image: Joi.string().allow(null, ""),
    // featured_image: Joi.string(),
    content: Joi.string().required(),
    seo_keywords: Joi.string().required(),
    author: Joi.string().required(),
  });

  const { error } = Schema.validate(req.body);
  if (error) {
    return next(error);
  }
  next();
};

const validateEventPagination = (req, res, next) => {
  const Schema = Joi.object({
    page: Joi.number().required(),
    limit: Joi.number().required(),
    publish_status: Joi.string()
      .required()
      .valid("draft", "published")
      .allow(""),
  });

  const { error } = Schema.validate(req.query);
  if (error) {
    return next(error);
  }
  next();
}

const validateEventQuery = (req, res, next) => {
  const Schema = Joi.object({
    eventId: Joi.number().required(),
  });

  const { error } = Schema.validate(req.query);
  if (error) {
    return next(error);
  }
  next();
}

module.exports = {
    validateEventPost,
  validatePaginationQuery,
  validatePublishStatus,
  validateUpdateBlogPost,
  validateDeleteEvent,
  validateUpdateEvent,
  validateEventPagination,
  validateEventQuery,
};
