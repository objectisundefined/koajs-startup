import Router from 'koa-router'

import { userRouter } from './user'
import { articleRouter } from './article'

const router = Router()

router.get('/', async (ctx, next) => {
  ctx.body = 'hello world'
})

router.use('/api/v1/users', userRouter.routes())
router.use('/api/v1/articles', articleRouter.routes())

export { router }
