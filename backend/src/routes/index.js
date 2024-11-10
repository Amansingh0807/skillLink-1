import Router from 'express'
import authRouter from './auth.js';
import auth from '../../middleware/auth.js';
import userInfoRouter from './userInfo.js';
import postRouter from './post.js';
import jobRouter from './job.js';
const router = Router()

router.use('/user/auth', authRouter);
router.use('/user/info', auth, userInfoRouter)
router.use('/user/post', auth, postRouter)
router.use('/user/job', auth, jobRouter)


export default router