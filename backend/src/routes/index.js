import Router from 'express'
import authRouter from './auth.js';
const router = Router()

router.use('/user/auth', authRouter);
export default router