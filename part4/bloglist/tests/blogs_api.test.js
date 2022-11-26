/* eslint-disable no-underscore-dangle */
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { expect, test, beforeEach, afterAll, describe } from '@jest/globals';
import app from '../app.js';
import Blog from '../models/blog.js';
import User from '../models/user.js';
import {
  initialBlogs,
  blogsInDb,
  usersInDb,
  addUser,
  getToken,
} from './test_helper.js';

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  await addUser();
  const username = 'root';
  const user = await User.findOne({ username });
  const blogObjects = initialBlogs.map(
    (b) =>
      new Blog({
        title: b.title,
        author: b.author,
        url: b.url,
        likes: b.likes,
        user: user._id,
      })
  );
  const promiseArray = blogObjects.map((b) => b.save());
  await Promise.all(promiseArray);
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
  const token = await getToken();
  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);
  const blogs = await blogsInDb();
  const titles = blogs.map((r) => r.title);
  expect(blogs).toHaveLength(initialBlogs.length + 1);
  expect(titles).toContain('New blog');
});

test('fails to create blog without a token', async () => {
  const newBlog = {
    title: 'New blog',
    author: 'Some author',
    url: 'new/url',
    likes: 200,
  };
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/);
  const blogs = await blogsInDb();
  expect(blogs).toHaveLength(initialBlogs.length);
});

test('likes property defaults to zero when missing from the request', async () => {
  const newBlog = {
    title: 'New blog',
    author: 'Some author',
    url: 'new/url',
  };
  const token = await getToken();
  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);
  const blogs = await blogsInDb();
  expect(blogs[2].likes).toBe(0);
});

test('title and url are required', async () => {
  const newBlog = { author: 'Some Author' };
  const token = await getToken();
  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(400);
});

test('deletes blog', async () => {
  const blogsBefore = await blogsInDb();
  const { id } = blogsBefore[0];
  const token = await getToken();
  await api
    .delete(`/api/blogs/${id}`)
    .set('Authorization', `bearer ${token}`)
    .expect(204);
  const blogsAfter = await blogsInDb();
  expect(blogsAfter).toHaveLength(blogsBefore.length - 1);
});

test('updates blog', async () => {
  const token = await getToken();
  const newBlog = {
    title: 'HTML is easy',
    author: 'Some author',
    url: 'some/url',
    likes: 1000,
  };
  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/);
  const blogs = await blogsInDb();
  const blog = blogs.find((b) => b.title === 'HTML is easy');
  expect(blog.likes).toBe(1000);
});

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username must be unique');

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('creation fails with proper statuscode and message if username is shorter than 3 chars', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'u',
      name: 'Some Name',
      password: '123456',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain(
      'is shorter than the minimum allowed length'
    );

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('creation fails with proper statuscode and message if password is shorter than 3 chars', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'uname',
      name: 'Some Name',
      password: '1',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain(
      'password must be at least 3 characters long'
    );

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
