const Joi = require("joi");

const createAdSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().positive().required(),
});

const updateAdSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  price: Joi.number().positive(),
});

const getAdSchema = Joi.object({
  adId: Joi.string().required(),
});

const deleteAdSchema = Joi.object({
  adId: Joi.string().required(),
});

module.exports = {
  createAdSchema,
  updateAdSchema,
  getAdSchema,
  deleteAdSchema,
};
