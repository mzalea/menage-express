import { Request, Response } from 'express';
import { registerUser, loginUser } from '../../models/account/userModel';

const handleUserRegistration = async (req: Request, res: Response) => {
  try {
    const { email, password, display_name } = req.body;
    const user = await registerUser(email, password, display_name);

    (req.session as any).userId = user.user_id;

    res.json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const handleUserLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    (req.session as any).userId = user.user_id;

    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { handleUserRegistration, handleUserLogin };