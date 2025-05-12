const Joi = require("joi");

exports.createSchema = Joi.object({
  title: Joi.string().min(2).required(),
  content: Joi.string().required().messages({
    "string.base": "content cannot be empty",
  }),
  summary: Joi.string().required().messages({
    "string.base": "summary cannot be empty",
  }),
  slug: Joi.string(),
});

exports.updateSchema = Joi.object({
  title: Joi.string().min(2),
  content: Joi.string(),
  summary: Joi.string(),
  slug: Joi.string(),
});
