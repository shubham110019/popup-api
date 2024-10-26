const User = require('../models/userModel');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken'); 

dotenv.config();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send OTP via email
const sendOtpMail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email - OTP Code',
    text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent successfully to ${email}`);
  } catch (error) {
    console.error(`Error sending OTP email to ${email}:`, error.message);
    throw new Error('Failed to send OTP email');
  }
};


// Function to generate a JWT token
const generateToken = (userId) => {
    const secretKey = '123t';  // Use a secure key here
    return jwt.sign({ id: userId }, secretKey);
};

// Register new user and send OTP
exports.register = async (req, res) => {
  try {
    const { name, lastname, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    console.log(`Generated OTP for ${email}: ${otp}`);

    const token = generateToken(email);

    // Create new user
    user = new User({
        name,
    lastname,
      email,
      password: hashedPassword,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000, // OTP expires in 10 minutes
      token,  // Save token in the database
    });

    await user.save();
    console.log(`User saved to database: ${email}`);

    // Send OTP email
    await sendOtpMail(email, otp);
    console.log(`OTP email sent successfully to ${email}`);

    res.status(200).json({ message: 'Registration successful, OTP sent to your email.' });
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify OTP and activate the user account
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Check if OTP matches and is not expired
    if (user.otp === otp && user.otpExpires > Date.now()) {
      user.isVerified = true;
      user.otp = undefined;  // Clear OTP after verification
      user.otpExpires = undefined;
      await user.save();

      return res.status(200).json({ message: 'Email verified successfully, you can now log in.', token: user.token });
    } else {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};



// Login without OTP after verification
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Check if user is verified
    if (!user.isVerified) return res.status(400).json({ message: 'Please verify your email before logging in.' });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

    // Update lastLogin field
    user.lastLogin = Date.now(); // Set lastLogin to current date and time
    await user.save(); // Save the updated user document

    res.status(200).json({ message: 'Login successful', token: user.token, userId: user.userId });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

  

// Get user by token
exports.getUserByToken = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];  // Extract token from Authorization header
  
    if (!token) {
      return res.status(401).json({ message: 'Access denied, token missing!' });
    }
  
    try {
      const secretKey = '123t';  // Use the same secret key used to sign the token
      const decoded = jwt.verify(token, secretKey);  // Verify and decode the token
  
      // Find the user by the ID from the decoded token
     //const user = await User.findById(decoded.id);  // Assuming the token contains the user ID as "id"

      const user = await User.findOne({ email: decoded.id }); 
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return user details if found
      res.status(200).json({
        message: 'true',
        user: {
          id: user._id,
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          userId: user.userId,
          isVerified: user.isVerified,
        },
      });
    } catch (error) {
      // Check for specific token errors
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
  
      // Log the error for debugging purposes
      console.error('Token verification failed:', error.message);
  
      // Return invalid token message for any other error
      return res.status(401).json({ message: 'Invalid token' });
    }
  };



  

  // Update any user field (PUT)
exports.updateUser = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];  // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Access denied, token missing!' });
  }

  try {
    const secretKey = '123t';  // Use the same secret key used to sign the token
    const decoded = jwt.verify(token, secretKey);  // Verify and decode the token

    // Find the user by email from the decoded token
    const user = await User.findOne({ email: decoded.id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Dynamically update fields from the request body
    const updatableFields = [
      'name', 'lastname', 'email', 'otp', 'otpExpires', 'isVerified', 
      'userPlan', 'userPlanType', 'createDate', 'lastLogin'
    ];

    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'password') {
          // Hash password if it's being updated
          user.password = bcrypt.hashSync(req.body.password, 10);
        } else {
          user[field] = req.body[field];
        }
      }
    });

    await user.save();

    res.status(200).json({
      message: 'User details updated successfully',
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }

    console.error('Token verification failed:', error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
