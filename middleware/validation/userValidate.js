const Joi = require("joi");

exports.registerSchema = Joi.object({
  firstName: Joi.string().min(3).max(20).required(),
  lastName: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required().messages({
    "string.min": "Password must be at least 6 characters.",
    "string.max": "Password must be at most 20 characters.",
  }),
  phone: Joi.string().min(10).max(10),
  instagramUrl: Joi.string(),
  facebookUrl: Joi.string(),
  githubUrl: Joi.string(),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
});

exports.updateSchema = Joi.object({
  firstName: Joi.string().min(3).max(20),
  lastName: Joi.string().min(3).max(20),
  phone: Joi.string().min(10).max(10),
  instagramUrl: Joi.string(),
  facebookUrl: Joi.string(),
  githubUrl: Joi.string(),
});
