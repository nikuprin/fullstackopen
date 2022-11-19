/* eslint-disable no-undef */
import mongoose from 'mongoose';
import supertest from 'supertest';
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

afterAll(() => {
  mongoose.connection.close();
});
