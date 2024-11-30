import express from 'express'
import router from './routes/index.js'
import 'dotenv/config';
import morgan from 'morgan';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "../utils/uploadthing.js";

const port = process.env.PORT || 3500;
const app = express()


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true

}));
app.use(express.json())
app.use(morgan('tiny'))
app.use(cookieParser())
app.use('/api/v1', router)
app.use(
    "/api/uploadthing",
    createRouteHandler({
        router: uploadRouter,
    }),
);

app.get("/ping", (req, res) => {
    res.send({ message: "Server is alive!" });
});


app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
})

