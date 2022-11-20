import mongoose from 'mongoose';
import supertest from 'supertest';
import { expect, test, beforeEach, afterAll } from '@jest/globals';
import app from '../app.js';
import Blog from '../models/blog.js';
import { initialBlogs, blogsInDb } from './test_helper.js';

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('correct amount of blogs is returned', async () => {
  const { length } = await blogsInDb();
  expect(length).toBe(2);
});

test('contains id', async () => {
  const blogs = await blogsInDb();
  expect(blogs[0]).toEqual(
    expect.objectContaining({
      id: expect.any(String),
    })
  );
});

test('creates blog', async () => {
  const newBlog = {
    title: 'New blog',
    author: 'Some author',
    url: 'new/url',
    likes: 200,
  };
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);
  const blogs = await blogsInDb();
  const titles = blogs.map((r) => r.title);
  expect(blogs).toHaveLength(initialBlogs.length + 1);
  expect(titles).toContain('New blog');
});

test('likes property defaults to zero when missing from the request', async () => {
  const newBlog = {
    title: 'New blog',
    author: 'Some author',
    url: 'new/url',
  };
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);
  const blogs = await blogsInDb();
  expect(blogs[2].likes).toBe(0);
});

test('title and url are required', async () => {
  const newBlog = { author: 'Some Author' };
  await api.post('/api/blogs').send(newBlog).expect(400);
});

test('deletes blog', async () => {
  const blogsBefore = await blogsInDb();
  const { id } = blogsBefore[0];
  await api.delete(`/api/blogs/${id}`).expect(204);
  const blogsAfter = await blogsInDb();
  expect(blogsAfter).toHaveLength(blogsBefore.length - 1);
});

test('updates blog', async () => {
  const newBlog = {
    title: 'HTML is easy',
    author: 'Some author',
    url: 'some/url',
    likes: 1000,
  };
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/);
  const blogs = await blogsInDb();
  const blog = blogs.find((b) => b.title === 'HTML is easy');
  expect(blog.likes).toBe(1000);
});

afterAll(() => {
  mongoose.connection.close();
});
