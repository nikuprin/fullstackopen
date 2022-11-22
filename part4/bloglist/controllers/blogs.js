/* eslint-disable no-underscore-dangle */
import express from 'express';
import Blog from '../models/blog.js';
import User from '../models/user.js';

const blogsRouter = express.Router();

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const { body } = request;
  const user = await User.findById(body.userId);
  const match = await Blog.find({ title: body.title });
  if (match.length > 0) {
    const person = await Blog.findByIdAndUpdate(
      match[0]._id,
      { likes: request.body.likes },
      { new: true, runValidators: true }
    );
    return response.json(person);
  }
  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });
  const result = await newBlog.save();
  user.blogs = user.blogs.concat(result._id);
  await user.save();
  return response.status(201).json(result);
});

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

export default blogsRouter;
