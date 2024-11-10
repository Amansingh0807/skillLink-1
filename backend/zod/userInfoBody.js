import z, { array, string } from "zod"

export const userInfoBody = z.object({
    bio: string().optional(),
    profilePic: string().optional(),
    skill: z.array(z.string()).max(10).optional(),
})