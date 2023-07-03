import Joi from 'joi'

export const createPostValidator = Joi.object({
  text: Joi.string().required(),
}).strict()



