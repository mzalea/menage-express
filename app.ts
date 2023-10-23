import express from 'express';
import session from 'express-session'
import cors from 'cors';
import dotenv from 'dotenv';

import { handleUserLogin, handleUserRegistration } from "./handlers/account/userHandler";
import connectDB from './utils/db';

connectDB();

const app = express();
app.use(express.json());

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

dotenv.config();

app.use(session({
  secret: process.env.SECRET_KEY as string || "its-super-secret",
  resave: false,
  saveUninitialized: true,
}));

const corsOptions = {
  origin: process.env.REACT_URL || "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.post('/api/register', handleUserRegistration);
app.post('/api/login', handleUserLogin)

const URI = process.env.EXPRESS_URI || "localhost"
const PORT = process.env.EXPRESS_PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on ${URI}:${PORT}`);
});