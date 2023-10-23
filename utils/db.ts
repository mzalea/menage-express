import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DEV_URI = "mongodb://localhost:27017/mydatabase"

const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGODB_URI || DEV_URI;

    await mongoose.connect(uri);

    console.log('MongoDB Connected');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error connecting to MongoDB:', error.message);
      throw error;
    } else {
      console.error('An unknown error occurred:', error);
      throw new Error('Unknown error occurred');
    }
  }
};

export default connectDB;
