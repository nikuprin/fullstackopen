import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import config from './utils/config.js';
import blogsRouter from './controllers/blogs.js';

await mongoose.connect(config.MONGODB_URI);
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogsRouter);

export default app;
