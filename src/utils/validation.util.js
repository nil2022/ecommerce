import Joi from "joi";

// Define the custom regex pattern
const emailPattern = /^[a-zA-Z0-9._%-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/;

export const userSignUpValidation = Joi.object({
    userId: Joi.string().required().messages({
        "string.empty": "User Id is required",
    }),
    email: Joi.string().pattern(emailPattern).required().messages({
        "string.pattern.base": "Invalid Email format",
        "string.empty": "Email is required",
    }),
    password: Joi.string().required().min(6).messages({
        "string.min": "Password must be at least 6 characters",
        "string.empty": "Password is required",
    })
}).options({ allowUnknown: true });

export const userSignInValidation = Joi.object({
    userId: Joi.string().required().messages({
        "string.empty": "User Id is required",
    }),
    password: Joi.string().required().messages({
        "string.empty": "Password is required",
    })
}).options({ allowUnknown: true });