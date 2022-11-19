import dotenv from 'dotenv';

dotenv.config();
const { PORT, NODE_ENV } = process.env;
const MONGODB_URI =
  NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;
const config = { MONGODB_URI, PORT };

export default config;
