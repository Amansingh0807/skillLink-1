import { PrismaClient } from '@prisma/client';
import Router from 'express'
import { userInfoBody } from '../../zod/userInfoBody.js';
import { error } from 'console';

const userInfoRouter = Router()
const prisma = new PrismaClient();

userInfoRouter.post('/add', async (req, res) => {

    try {
        const parseResult = userInfoBody.safeParse(req.body);

        if (!parseResult.success) {
            return res.status(400).json({
                error: "Incorrect data type"
            });
        }
        const { bio, skill } = parseResult.data;
        await prisma.profile.upsert({
            where: {
                userId: req.userId,
            },
            update: {
                bio: bio,
                skills: skill,
            },
            create: {
                bio: bio,
                skills: skill,
                userId: req.userId
            }
        })
        res.status(200).json({
            msg: "Profile info added successfully"
        })
    } catch (err) {
        return res.status(500).json({
            error: err.message || err.toString()
        })
    }

})

userInfoRouter.get('/profile', async (req, res) => {
    try {
        const userInfo = await prisma.user.findFirst({
            where: {
                id: req.userId,
            },
            select: {
                username: true,
                email: true,
                name: true,
                profile: true
            }
        })
        return res.status(200).json({
            data: userInfo
        })
    } catch (err) {
        return res.status(500).json({
            error: err.message || err.toString()
        })
    }
})

export default userInfoRouter;