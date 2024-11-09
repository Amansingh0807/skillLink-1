import zod from 'zod';

export const loginBody = zod.object({
    username: zod.string().optional(),
    email: zod.string().email().optional(),
    password: zod.string(),
}).refine(data => data.username || data.email, {
    message: "Either username or email is required",
    path: ["username", "email"],
});
