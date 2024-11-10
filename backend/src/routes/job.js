import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { jobBody } from "../../zod/jobBody.js";

const jobRouter = Router();
const prisma = new PrismaClient()

jobRouter.post('/post', async (req, res) => {
    try {
        const parseResult = jobBody.safeParse(req.body);

        if (!parseResult.success) {
            return res.status(400).json({
                error: "Incorrect data type"
            });
        }
        const { title, desc, location, salary, jobType } = parseResult.data
        await prisma.job.create({
            data: {
                title: title,
                description: desc,
                location: location,
                salary: salary,
                jobType: jobType,
                userId: req.userId
            }
        })

        res.status(200).json({
            msg: "Job posted succesfully"
        })
    } catch (err) {
        return res.status(500).json({
            error: err.message || err.toString()
        })
    }

})


export default jobRouter;