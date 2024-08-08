
const express = require('express');
const mongoose = require('mongoose');
const body_parser = require('body-parser');
const cors = require('cors');
const app = express();
require('dotenv').config();
const bcrypt = require('bcryptjs'); // Add bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Add jsonwebtoken for JWT

app.use(cors());
app.use(body_parser.json());
const PORT = 5000
const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model('User', userSchema);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


app.get('/', (req, res) => {
    res.send('Backend server is running');
});
app.post('/signup', async (req, res) => {
  try {
      const { fname, lname, email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10); 
      const user = new User({ fname, lname, email,  password: hashedPassword  });
      await user.save();
      console.log('ghjsad');

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ message: 'User created successfully',token});
      
  } catch (error) {
    console.log(error);
    
      res.status(400).json({ message: 'Error creating user',error: JSON.stringify(error) });
  }
});
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login request received:', email); // Log email for debugging

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email); // Log user not found
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password for user:', email); // Log invalid password
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful:', email); // Log successful login
    res.status(200).json({ token });
  } catch (error) {
    console.error('Server error during login:', error); // Log server error
    res.status(500).json({ message: 'Server error', error });
  }
});