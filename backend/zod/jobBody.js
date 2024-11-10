import z from 'zod'

const jobType = z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"]);
export const jobBody = z.object({
    title: z.string(),
    desc: z.string(),
    location: z.string(),
    salary: z.number().optional(),
    jobType: jobType
})