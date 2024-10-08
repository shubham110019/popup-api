const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  lastname: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  token: { type: String } // New field to store the JWT token
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
