/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
});

blogSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
