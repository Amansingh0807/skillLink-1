import z from "zod"

export const commentBody = z.object({
    desc: z.string(),
    postId: z.number()
})