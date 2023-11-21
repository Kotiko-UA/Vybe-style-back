const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const allowedMimeTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
  "application/msword",
  "application/zip",
  "image/svg+xml",
];
const MAX_TOTAL_FILE_SIZE = 20 * 1024 * 1024;

const nameRegexp = /^[а-яА-Яa-zA-Z' -]*$/u;
const phoneRegexp = /^(?:\+\d{1,3}\s?)?(\d{1,4}[\s-()])?\d{7,15}$/;
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      match: nameRegexp,
      required: [true, "Set your contact name"],
    },
    email: {
      type: String,
      required: [true, "Set your contact emailt"],
    },
    phone: {
      type: String,
      match: phoneRegexp,
      required: [true, "Set your contact phone"],
    },
    company: { type: String },
    message: {
      type: String,
    },
    multiple_files: {
      type: [],
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleMongooseError);
const Contact = model("contact", contactSchema);

const ContactAddSchema = Joi.object({
  name: Joi.string().min(3).max(30).pattern(nameRegexp).messages({
    "string.base": "Name should be a text",
    "string.alphanum": "Name should only contain letters and numbers",
    "string.min": "Name should be at least {#limit} characters long",
    "string.max": "Name should not be more than {#limit} characters long",
    "any.required": "Name is a required field",
  }),
  email: Joi.string().email().pattern(emailRegex).messages({
    "string.base": "Email should be a text",
    "string.email": "Enter a valid email format - example@email.com",
    "any.required": "Email is a required field",
  }),
  phone: Joi.string().pattern(phoneRegexp).messages({
    "string.base": "Phone number should be a text",
    "any.required": "Phone number is a required field",
  }),
  company: Joi.string().messages({
    "string.base": "Company should be a text",
    "string.alphanum": "Company should only contain letters and numbers",
  }),
  message: Joi.string(),
  multiple_files: Joi.array()
    .items(
      Joi.object({
        originalname: Joi.string().required(),
        mimetype: Joi.string()
          .valid(...allowedMimeTypes)
          .required(),
        size: Joi.number().max(MAX_TOTAL_FILE_SIZE).required(),
      })
    )
    .max(MAX_TOTAL_FILE_SIZE),
});

const schemas = {
  ContactAddSchema,
};

module.exports = {
  schemas,
  Contact,
};
