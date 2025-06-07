import { MongoClient } from 'mongodb';
import config from '../config';

const client = new MongoClient(config.mongoURI);

export async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db();
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
} 