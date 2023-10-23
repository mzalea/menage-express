import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { User } from '../../models/account/userModel';

const handleUserRegistration = async (req: Request, res: Response) => {
  try {
    const { email, password, display_name } = req.body;
    const hashedPassword = await hashPassword(password);
    const user = User.build({
      email,
      passwordHash: hashedPassword,
      displayName: display_name,
    });
    await user.save();

    req.session.userId = user._id;

    res.json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const handleUserLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await comparePasswords(password, user.passwordHash);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    req.session.userId = user._id;

    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const comparePasswords = async (password: string, hashedPassword: string) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

const hashPassword = async (password: string) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
};

export { handleUserRegistration, handleUserLogin };