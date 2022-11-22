import 'express-async-errors';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import config from './utils/config.js';
import { errorHandler } from './utils/middleware.js';
import blogsRouter from './controllers/blogs.js';
import usersRouter from './controllers/users.js';

await mongoose.connect(config.MONGODB_URI);
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use(errorHandler);

export default app;
