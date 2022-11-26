/* eslint-disable no-underscore-dangle */
import express from 'express';
import Blog from '../models/blog.js';

const blogsRouter = express.Router();

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const { body, user } = request;
  if (!user) {
    return response.status(401).json({
      error: 'token is missing',
    });
  }
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
  const blog = await Blog.findById(request.params.id);
  if (blog.user.toString() !== request.user.id.toString()) {
    return response.status(401).json({
      error: 'blog can be deleted only by the user who added the blog',
    });
  }
  await Blog.findByIdAndRemove(request.params.id);
  return response.status(204).end();
});

export default blogsRouter;
