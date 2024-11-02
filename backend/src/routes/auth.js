import Router from 'express'
import bycrpt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { registerBody } from '../../zod/registerBody.js';
import User from '../../db/userRegistration.js'

const authRouter = Router();

authRouter.post('/register', async (req, res) => {
    const { data } = registerBody.safeParse(req.body);

    if (!data) {
        return res.status(411).json({
            error: "Fill all data/ Incorrect data type"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(403).json({
            error: "user already exist"
        });
    }

    try {
        const hash = await bycrpt.hash(req.body.password, 11);
        const user = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: hash
        })

        const payload = {
            username: user.username,
            userId: user._id
        }

        const token = jwt.sign(payload, process.env.JWT_PASSWORD);

        res.cookie("access_token", token, {
            expires: new Date(Date.now() + 250000000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None'
        }).status(200).json({
            msg: "Signup success"
        })

    } catch (err) {
        return res.status(500).json({
            error: err.message || err.toString()
        })
    }


})

export default authRouter