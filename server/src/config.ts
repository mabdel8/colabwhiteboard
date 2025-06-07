import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const config = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/whiteboard',
};

export default config; 