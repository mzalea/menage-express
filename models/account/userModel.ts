import bcrypt from 'bcrypt';
import pool from '../../utils/db';

const hashPassword = async (password: string) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
};

const registerUser = async (email: string, password: string, display_name: string) => {
  try {
    const hashedPassword = await hashPassword(password);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, display_name) VALUES ($1, $2, $3) RETURNING *',
      [email, hashedPassword, display_name]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
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

const loginUser = async (email: string, password: string) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return null; // User not found
    }

    const user = result.rows[0];
    const isPasswordValid = await comparePasswords(password, user.password_hash);

    if (!isPasswordValid) {
      return null; // Invalid password
    }
    
    return user;
  } catch (error) {
    throw error;
  }
};

const initAccountsTables = async () => {
  try {
    pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            user_id SERIAL PRIMARY KEY,
            email VARCHAR(100) UNIQUE,
            password_hash VARCHAR(255),
            display_name VARCHAR(50)
        )
    `);
    
    pool.query(`
        CREATE TABLE IF NOT EXISTS families (
            family_id SERIAL PRIMARY KEY,
            family_name VARCHAR(100),
            created_by_user_id INTEGER REFERENCES users(user_id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    
    pool.query(`
        CREATE TABLE IF NOT EXISTS family_members (
            family_member_id SERIAL PRIMARY KEY,
            family_id INTEGER REFERENCES families(family_id),
            user_id INTEGER REFERENCES users(user_id),
            role VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

initAccountsTables();

export { registerUser, loginUser };
