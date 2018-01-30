import jwt from 'jsonwebtoken'
import { secret } from '../config'

const getTokenFromHeader = req => {
  const auth = req.headers.authorization

  if (!auth) {
    return null
  }

  const [key, val] = auth.split(/\s+/)

  return (key === 'Token' || key === 'Bearer') ? val : null
}

const authMiddleware = (middware) => async (ctx, next) => {
  const token = getTokenFromHeader(ctx.request)

  try {
    jwt.verify(token, secret)
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return ctx.error('token expired')
    } else {
      return ctx.throw(401, 'token invalid')
    }
  }

  const { payload } = jwt.decode(token, { complete: true })
  ctx.request.payload = payload

  await middware(ctx, next)
}

export { authMiddleware }
