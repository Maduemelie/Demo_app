import Joi from 'joi'

export const createUserValidator = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  gender: Joi.string().required(),
  dateOfBirth: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
}).strict()

export const loginValidator = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
}).strict()


