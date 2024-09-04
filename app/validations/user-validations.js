import { User } from "../models/userModel.js";

export const userRegisterValidations = {
    name: {
        in: ['body'],
        exists: {
            errorMessage: "Name is required"
        },
        notEmpty: {
            errorMessage: "Name cannot be empty"
        },
        trim: true
    },
    email: {
        in: ['body'],
        exists: {
            errorMessage: "Email is required"
        },
        notEmpty: {
            errorMessage: "Email cannot be empty"
        },
        isEmail: {
            errorMessage: "Email Should be In valid format"
        },
        custom: {
            options: async (value) => {
                const user = await User.findOne({ email: value })
                if (user) {
                    throw new Error('Email Already Taken')
                } else {
                    return true
                }
            }
        },
        trim: true,
        normalizeEmail: true
    },
    password: {
        in: ['body'],
        exists: {
            errorMessage: "Password is required"
        },
        notEmpty: {
            errorMessage: "Password cannot be empty"
        },
        isLength: {
            options: { min: 8, max: 128 },
            errorMessage: 'Password should be between 8-128 character'
        },
        trim: true
    },
}
