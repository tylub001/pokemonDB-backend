const { Joi, celebrate } = require("celebrate");

const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    image: Joi.string().uri().required(),
    description: Joi.string().allow("").optional(),
    isLegendary: Joi.boolean().optional(),
    isMythical: Joi.boolean().optional(),
  }),
});

const validateAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateRegistration = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().allow("").optional(),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required().messages({
      "string.hex": 'The "pokemonId" must be a valid hex string',
      "string.length": 'The "itemId" must be 24 characters long',
      "any.required": 'The "itemId" parameter is required',
    }),
  }),
});

module.exports = {
  validateCardBody,
  validateId,
  validateAuth,
  validateRegistration,
};
