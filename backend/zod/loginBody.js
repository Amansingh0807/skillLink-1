import zod from 'zod'

export const loginBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
})