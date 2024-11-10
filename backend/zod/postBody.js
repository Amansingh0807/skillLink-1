import z from "zod"

export const postBody = z.object({
    desc: z.string(),
    contentType: z.array(z.string()).max(10).optional(),

})