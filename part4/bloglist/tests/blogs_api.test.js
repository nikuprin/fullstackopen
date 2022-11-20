import mongoose from 'mongoose';
import supertest from 'supertest';
import { expect, test, beforeEach, afterAll } from '@jest/globals';
import app from '../app.js';
import Blog from '../models/blog.js';

const api = supertest(app);

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'Some author',
    url: 'some/url',
    likes: 10,
  },
  {
    title: 'Testing is easy',
    author: 'Some author',
    url: 'test/url',
    likes: 100,
  },
];

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
  const response = await api.get('/api/blogs');
  const { length } = response.body;
  expect(length).toBe(2);
});

test('contains id', async () => {
  const response = await api.get('/api/blogs');
  const object = response.body[0];
  expect(object).toEqual(
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
  const response = await api.get('/api/blogs');
  const titles = response.body.map((r) => r.title);
  expect(response.body).toHaveLength(initialBlogs.length + 1);
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
  const response = await api.get('/api/blogs');
  expect(response.body[2].likes).toBe(0);
});

test('title and url are required', async () => {
  const newBlog = { author: 'Some Author' };
  await api.post('/api/blogs').send(newBlog).expect(400);
});

afterAll(() => {
  mongoose.connection.close();
});
