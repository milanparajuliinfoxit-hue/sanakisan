const Joi = require("joi");

const validateNoticePost = (req, res, next) => {
  const Schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required().allow("", null),
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

const validateNoticeUpdate = (req, res, next) => {
  const Schema = Joi.object({
    id: Joi.string().required(),
    title: Joi.string().required(),
    content: Joi.string().required().allow("", null),
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



const validateDeleteNotice = (req, res, next) => {
  const Schema = Joi.object({
    noticeId: Joi.number().required(),
  });

  const { error } = Schema.validate(req.body);
  if (error) {
    return next(error);
  }
  next();
};

const validateNoticePaginationQuery = (req, res, next) => {
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

const validateNoticeQuery = (req, res, next) => { 
  const Schema = Joi.object({
    noticeId: Joi.number().required(),
  });

  const { error } = Schema.validate(req.query);
  if (error) {
    return next(error);
  }
  next();
}


module.exports = {
  validateNoticePost,
  validateNoticePaginationQuery,
  validatePublishStatus,
  validateNoticeUpdate,
  validateDeleteNotice,
  validateNoticeQuery,
};
