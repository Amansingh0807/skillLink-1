import Router from "express";
import { postBody } from "../../zod/postBody.js";
import { PrismaClient } from "@prisma/client";
import auth from '../../middleware/auth.js';
import { commentBody } from "../../zod/commentBody.js";

const postRouter = Router()
const prisma = new PrismaClient()

postRouter.post('/add', auth, async (req, res) => {
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

postRouter.get('/postid/:postId', async (req, res) => {
    try {
        const postid = Number(req.params.postId)
        const post = await prisma.post.findFirst({
            where: {
                id: postid
            },
            select: {
                id: true,
                desc: true,
                like: true,
                comment: true,
                contentType: true,
                User: {
                    select: {
                        username: true,
                        id: true,
                        profile: {
                            select: {
                                profilePic: true
                            }
                        }
                    }
                }
            }
        })
        if (post == null) {
            return res.status(200).json({
                post: "No post"
            })
        }
        return res.status(200).json({
            post: post
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
                id: true,
                desc: true,
                like: true,
                contentType: true,
                comment: true,
                User: {
                    select: {
                        username: true,
                        id: true,
                        profile: {
                            select: {
                                profilePic: true
                            }
                        }
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
                id: true,
                desc: true,
                like: true,
                comment: {
                    select: {
                        desc: true
                    }
                },
                contentType: true,
                User: {
                    select: {
                        username: true,
                        id: true,
                        profile: {
                            select: {
                                profilePic: true
                            }
                        }
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

postRouter.post('/addcomment', auth, async (req, res) => {

    try {
        const parseResult = commentBody.safeParse(req.body);

        if (!parseResult.success) {
            return res.status(400).json({
                error: "Incorrect data type"
            });
        }
        const { desc, postId } = parseResult.data;

        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const author = await prisma.user.findUnique({ where: { id: req.userId } });
        if (!author) {
            return res.status(404).json({ error: 'Author not found' });
        }

        await prisma.comment.create({
            data: {
                desc,
                authorId: req.userId,
                like: 0,
                postId,
            },

        });

        return res.status(200).json({
            msg: 'Comment added successfully'
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message || err.toString()
        })
    }
});

postRouter.get('/comments/:postId', async (req, res) => {
    const postid = Number(req.params.postId);
    try {
        const comment = await prisma.comment.findMany({
            where: {
                postId: postid
            },
            select: {
                desc: true,
                like: true,
                authorId: true,
                Author: {
                    select: {
                        id: true,
                        username: true,
                        profile: {
                            select: {
                                profilePic: true
                            }
                        }
                    }
                }
            }
        })
        if (comment.length <= 0) {
            return res.status(200).json({
                comment: "No comments"
            });
        }
        return res.status(200).json({
            comment: comment
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message || err.toString()
        })
    }
})

export default postRouter;