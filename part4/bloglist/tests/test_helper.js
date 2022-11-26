/* eslint-disable no-underscore-dangle */
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Blog from '../models/blog.js';
import User from '../models/user.js';
import config from '../utils/config.js';

export const initialBlogs = [
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

export const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

export const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

export const addUser = async () => {
  const passwordHash = await bcrypt.hash('sekret', 10);
  const user = new User({ username: 'root', passwordHash });
  await user.save();
};

export const getToken = async () => {
  const username = 'root';
  const user = await User.findOne({ username });
  const userForToken = {
    username: user.username,
    id: user._id,
  };
  return jsonwebtoken.sign(userForToken, config.SECRET);
};
