import dotenv from 'dotenv';

dotenv.config();
const { PORT, MONGODB_URI } = process.env;
const config = { MONGODB_URI, PORT };

export default config;
