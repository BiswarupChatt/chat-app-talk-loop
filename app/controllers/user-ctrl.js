export const userCtrl = {}
import { User } from "../models/userModel.js"
import bcryptjs from "bcryptjs"
import jwt from 'jsonwebtoken'
import { validationResult } from "express-validator"

userCtrl.register = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const body = req.body
        const salt = await bcryptjs.genSalt()
        const hashPassword = await bcryptjs.hash(body.password, salt)
        const user = new User({ ...body, password: hashPassword })
        await user.save()
        res.status(201).json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: 'Something went wrong.', err })
    }
}

userCtrl.login = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const body = req.body
        const user = await User.findOne({ email: body.email })
        if (user) {
            const isAuth = await bcryptjs.compare(body.password, user.password)
            if (isAuth) {
                const tokenData = {
                    id: user._id
                }
                const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
                return res.status(200).json({ token: token })
            } else {
                return res.status(500).json({ errors: 'Invalid Password' })
            }
        } else {
            return res.status(500).json({ errors: 'Invalid Email.' })
        }
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong.' })
    }
}
