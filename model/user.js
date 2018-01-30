import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { secret } from '../config'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, 'can\'t be blank'],
      match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
      index: true
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      index: true
    },
    biography: String,
    avatar: String,
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'article' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    hash: String,
    salt: String
  },
  { timestamps: true }
)

userSchema.plugin(uniqueValidator, { message: 'is already taken.' })

userSchema.methods.validPassword = function (password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10 ** 4, 512, 'sha512').toString('hex')

  return (this.hash = hash)
}

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10 ** 4, 512, 'sha512').toString('hex')
}

userSchema.methods.generateJWT = function () {
  return jwt.sign({
    _id: this._id,
    name: this.name
  }, secret, { expiresIn: '24h' })
}

userSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    token: this.generateJWT(),
    biography: this.biography,
    avatar: this.avatar
  }
}

userSchema.methods.toProfileJSONFor = function (user) {
  return {
    _id: this._id,
    name: this.name,
    biography: this.biography,
    avatar: this.avatar || '',
    following: user ? user.isFollowing(this._id) : false
  }
}

userSchema.methods.favorite = function (id) {
  if (this.favorites.indexOf(id) === -1) {
    this.favorites.push(id)
  }

  return this.save()
}

userSchema.methods.unfavorite = function (id) {
  this.favorites.remove(id)

  return this.save()
}

userSchema.methods.isFavorite = function (id) {
  return this.favorites.some(x => String(x) === String(id))
}

userSchema.methods.follow = function (id) {
  if (this.following.indexOf(id) === -1) {
    this.following.push(id)
  }

  return this.save()
}

userSchema.methods.unfollow = function (id) {
  this.following.remove(id)

  return this.save()
}

userSchema.methods.isFollowing = function (id) {
  return this.following.some(x => String(x) === String(id))
}

const userModel = mongoose.model('user', userSchema)

export { userModel }
