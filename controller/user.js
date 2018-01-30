import { userModel as User } from '../model/user'

const login = async (ctx, next) => {
  const { name, password } = ctx.request.body

  const u = await User.findOne({ name })

  if (!u) {
    return ctx.error('user was not found!')
  }

  if (!u.validPassword(password)) {
    return ctx.error('incorrect password')
  }

  ctx.send(u.toAuthJSON())
}

const signin = async (ctx, next) => {
  const u = new User()

  u.name = ctx.request.body.name
  u.email = ctx.request.body.email
  u.setPassword(ctx.request.body.password)

  try {
    await u.save()

    ctx.send(u.toAuthJSON())
  } catch (err) {
    ctx.error(err.message)
  }
}

const userController = {
  login,
  signin
}

export { userController }
