const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required().messages({
      "any.required": "Title is required.",
      "string.empty": "Title cannot be empty.",
    }),
    description: Joi.string().required().messages({
      "any.required": "Description is required.",
      "string.empty": "Description cannot be empty.",
    }),
    price: Joi.number().greater(0).required().messages({
      "any.required": "Price is required.",
      "number.base": "Price must be a number.",
      "number.greater": "Price must be greater than 0.",
    }),
    location: Joi.string().required().messages({
      "any.required": "Location is required.",
      "string.empty": "Location cannot be empty.",
    }),
    country: Joi.string().required().messages({
      "any.required": "Country is required.",
      "string.empty": "Country cannot be empty.",
    }),
    image: Joi.object({
      url: Joi.string()
        .uri()
        .allow("", null)
        .messages({ "string.uri": "Image URL must be a valid URL." }),
      filename: Joi.string().allow("", null),
    }).default({ url: "", filename: "" }),
  }).required(),
});

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});

// ✅ Export both schemas correctly
module.exports = { listingSchema, reviewSchema };
