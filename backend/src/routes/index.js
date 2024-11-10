import Router from 'express'
import authRouter from './auth.js';
import auth from '../../middleware/auth.js';
import userInfoRouter from './userInfo.js';
const router = Router()

router.use('/user/auth', authRouter);
router.use('/user/info', auth, userInfoRouter)
export default router