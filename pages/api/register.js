// pages/api/register.js
import bcrypt from 'bcrypt';
import connectToDatabase from '../../lib/mongodb';
import User from '../../models/User';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await connectToDatabase();

    const { name, email, password } = req.body;

    // Sprawdź, czy użytkownik już istnieje
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Zaszyfruj hasło
    const hashedPassword = await bcrypt.hash(password, 10);

    // Dodaj użytkownika do bazy danych
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User created successfully', user });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
