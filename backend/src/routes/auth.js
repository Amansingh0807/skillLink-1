import Router from 'express'
import bycrpt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from "@prisma/client";
import { registerBody } from '../../zod/registerBody.js';
import { loginBody } from '../../zod/loginBody.js';

const prisma = new PrismaClient();
const authRouter = Router();

authRouter.post('/register', async (req, res) => {

    try {
        const { data } = registerBody.safeParse(req.body);

        if (!data) {
            return res.status(411).json({
                error: "Fill all data/ Incorrect data type"
            })
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: data.username },
                    { email: data.email }
                ]
            }
        })

        if (existingUser) {
            return res.status(403).json({
                error: "user already exist"
            });
        }
        const hash = await bycrpt.hash(data.password, 11);
        const user = await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                username: data.username,
                password: hash
            }
        })

        const payload = {
            username: user.username,
            userId: user.id
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

authRouter.post('/login', async (req, res) => {

    try {
        const { data } = loginBody.safeParse(req.body);

        if (!data) {
            return res.status(411).json({
                error: "Fill all data/ Incorrect data type"
            })
        }
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: data.username },
                    { email: data.email }
                ]
            }
        })

        if (!existingUser) {
            return res.status(403).json({
                error: "user does't exist"
            });
        }

        const passwordVerify = await bycrpt.compare(data.password, existingUser.password);
        if (!passwordVerify) {
            return res.status(403).json({
                error: "Invalid credentials"
            });
        }

        const payLoad = {
            username: existingUser.username,
            userID: existingUser.id

        }
        const token = jwt.sign(payLoad, process.env.JWT_PASSWORD);

        return res.cookie("access_token", token, {
            expires: new Date(Date.now() + 250000000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None'
        }).status(200).json({
            msg: "Login success"
        })

    } catch (err) {
        return res.status(500).json({
            error: err.message || err.toString()
        })
    }

})

authRouter.get('/logout', (req, res) => {

    res.clearCookie('access_token');
    return res.status(200).json({
        msg: "Logout successfull"
    })

})
export default authRouter