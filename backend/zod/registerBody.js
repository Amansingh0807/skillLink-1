import zod from 'zod'

export const registerBody = zod.object({
    username: zod.string(),
    name: zod.string(),
    email: zod.string().email(),
    password: zod.string(),
})
