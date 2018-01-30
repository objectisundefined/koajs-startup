import mongoose from 'mongoose'

const commentSchema = mongoose.Schema({
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  article: { type: mongoose.Schema.Types.ObjectId, ref: 'article' }
}, { timestamps: true })

commentSchema.methods.toJSONFor = function (user) {
  return {
    id: this._id,
    content: this.content,
    createdAt: this.createdAt,
    author: this.author.toProfileJSONFor(user)
  }
}

const commentModel = mongoose.model('comment', commentSchema)

export { commentModel }
