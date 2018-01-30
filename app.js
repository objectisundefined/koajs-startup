import Koa from 'koa'
import logger from 'koa-logger'
import body from 'koa-body'
import mongoose from 'mongoose'

import { router } from './router'
import { mongodb } from './config'

const app = new Koa()

app.use(logger())
app.use(body())

mongoose.connect(mongodb.url, err => {
  if (err) {
    console.log('mongodb connect error')
  } else {
    console.log('mongodb connected')
  }
})

const send = () => async (ctx, next) => {
  const send = ctx => {
    return (json, msg) => {
      ctx.set('Content-Type', 'application/json')
      ctx.body = JSON.stringify({
        code: 1,
        data: json || {},
        msg: msg || 'success'
      })
    }
  }

  const error = ctx => {
    return msg => {
      ctx.set('Content-Type', 'application/json')
      ctx.body = JSON.stringify({
        code: 0,
        data: {},
        msg: msg.toString()
      })
    }
  }
  ctx.send = send(ctx)
  ctx.error = error(ctx)

  await next()
}

app.use(send())

app.use(router.routes())

const port = 3000
const host = '127.0.0.1'

app.listen(3000, host, () => {
  console.log(`server is running at http://${host}:${port}`)
})
