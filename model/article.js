import mongoose from 'mongoose'
import { userModel as User } from './user'

const articleSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    content: String,
    favoritesCount: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }],
    tagList: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
  },
  { timestamps: true }
)

articleSchema.methods.updateFavoriteCount = function () {
  const article = this

  return User.count({ favorites: { $in: [article._id] } }).then(function (
    count
  ) {
    article.favoritesCount = count

    return article.save()
  })
}

articleSchema.methods.toJSONFor = function (user) {
  return {
    _id: this._id,
    title: this.title,
    description: this.description,
    content: this.content,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    tagList: this.tagList,
    favorited: user ? user.isFavorite(this._id) : false,
    favoritesCount: this.favoritesCount,
    author: this.author.toProfileJSONFor(user)
  }
}

const articleModel = mongoose.model('article', articleSchema)

export { articleModel }
