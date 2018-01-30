import { articleModel as Article } from '../model/article'
import { userModel as User } from '../model/user'

const create = async (ctx, next) => {
  const u = await User.findById(ctx.request.payload._id)

  if (!u) {
    return ctx.throw(401, 'token invalid')
  }

  const a = new Article(ctx.request.body)
  a.author = u

  try {
    await a.save()
  } catch (err) {
    return ctx.error(err.message)
  }

  return ctx.send(a.toJSONFor(u))
}

const get = async (ctx, next) => {
  try {
    const [u, a] = [
      await User.findById(ctx.request.payload._id),
      await Article.findOne({ _id: ctx.params.id }).populate('author')
    ]

    ctx.send(a.toJSONFor(u))
  } catch (err) {
    return ctx.error(err.message)
  }
}

const articleController = {
  create,
  get
}

export {
  articleController
}
