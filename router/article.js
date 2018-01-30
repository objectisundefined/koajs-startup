import Router from 'koa-router'

import { articleController } from '../controller/article'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.post('/', authMiddleware(articleController.create))
router.get('/:id', authMiddleware(articleController.get))

export { router as articleRouter }
