import Router from "express";
import { postBody } from "../../zod/postBody.js";
import { PrismaClient } from "@prisma/client";

const postRouter = Router()
const prisma = new PrismaClient()

postRouter.post('/add', async (req, res) => {
    try {
        const parseResult = postBody.safeParse(req.body);

        if (!parseResult.success) {
            return res.status(400).json({
                error: "Incorrect data type"
            });
        }
        const { desc, contentType } = parseResult.data;

        await prisma.post.create({
            data: {
                desc: desc,
                contentType: contentType,
                like: 0,
                authorId: req.userId,

            }
        })

        return res.status(200).json({
            msg: "post uploaded"
        })

    } catch (err) {
        return res.status(500).json({
            error: err.message || err.toString()
        })
    }
})


postRouter.get('/all', async (req, res) => {
    try {
        const post = await prisma.post.findMany({
            where: {
                authorId: req.userId
            },
            select: {
                desc: true,
                like: true,
                comment: true,
                contentType: true,
                User: {
                    select: {
                        username: true,
                        id: true,
                    }
                }
            }
        })
        return res.status(200).json({
            post: post
        })
    } catch (err) {
        return res.status(500).json({
            error: err.message || err.toString()
        })
    }
})

postRouter.get('/all-posts', async (req, res) => {
    try {
        const post = await prisma.post.findMany({
            select: {
                desc: true,
                like: true,
                comment: true,
                contentType: true,
                User: {
                    select: {
                        username: true,
                        id: true,
                    }
                }
            }
        })
        return res.status(200).json({
            post: post
        })
    } catch (err) {
        return res.status(500).json({
            error: err.message || err.toString()
        })
    }
})

export default postRouter;