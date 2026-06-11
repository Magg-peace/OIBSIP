import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || '';

    // If it's a local URI and we want to use memory server as fallback
    if (mongoUri === '' || mongoUri.includes('127.0.0.1') || mongoUri.includes('localhost')) {
      try {
        console.log(`Attempting to connect to local MongoDB at ${mongoUri}...`);
        const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
        console.log(`Local MongoDB Connected: ${conn.connection.host}`);
        return;
      } catch (localError) {
        console.log(`Local MongoDB not found. Starting In-Memory Database for instant testing...`);
        mongoServer = await MongoMemoryServer.create();
        const memoryUri = mongoServer.getUri();
        const conn = await mongoose.connect(memoryUri);
        console.log(`🟢 In-Memory MongoDB Connected: ${conn.connection.host}`);
        console.log(`NOTE: Data will be reset when the server restarts. Use a MongoDB Atlas URI for permanent storage.`);
        return;
      }
    }

    // Connect to Atlas or actual DB
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
