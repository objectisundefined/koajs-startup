import Router from 'koa-router'
import { userController } from '../controller/user'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.post('/', userController.signin)

router.post('/login', userController.login)

router.get('/private', authMiddleware(async (ctx, next) => {
  ctx.send('you are accessd')
}))

export { router as userRouter }
