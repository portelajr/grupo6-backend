const Joi = require('joi');

const newEventSchema = Joi.object({
  img: Joi.string().required(),
  title: Joi.string().required(),
  date: Joi.string().required(),
  description: Joi.string().required(),
  city: Joi.string().required(),
  type: Joi.string().required(),
  protocolPandemic: Joi.string().required(),
});

module.exports = newEventSchema;
