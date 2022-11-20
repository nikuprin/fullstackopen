import express from 'express';
import Blog from '../models/blog.js';

const blogsRouter = express.Router();

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const match = await Blog.find({ title: request.body.title });
  if (match.length > 0) {
    const person = await Blog.findByIdAndUpdate(
      // eslint-disable-next-line no-underscore-dangle
      match[0]._id,
      { likes: request.body.likes },
      { new: true, runValidators: true }
    );
    return response.json(person);
  }

  const blog = new Blog(request.body);
  const result = await blog.save();
  return response.status(201).json(result);
});

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

export default blogsRouter;
