import express from 'express';
import session from 'express-session'
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const corsOptions = {
  origin: process.env.REACT_URL,
  optionsSuccessStatus: 200,
};

import { handleUserLogin, handleUserRegistration } from "./handlers/account/userHandler";

const app = express();
app.use(express.json());

app.use(session({
  secret: process.env.SECRET_KEY as string,
  resave: false,
  saveUninitialized: true,
}));

app.use(cors(corsOptions));

app.post('/api/register', handleUserRegistration);
app.post('/api/login', handleUserLogin)

const PORT = process.env.EXPRESS_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});