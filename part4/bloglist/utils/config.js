import dotenv from 'dotenv';

dotenv.config();
const { PORT, NODE_ENV, SECRET } = process.env;
const MONGODB_URI =
  NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;
const config = { MONGODB_URI, PORT, SECRET };

export default config;
