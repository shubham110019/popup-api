const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  userId: { type: Number, unique: true },
  name: { type: String },
  lastname: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  token: { type: String },
  userPlan: {type: String, default: "L1"},
  userPlanType: {type: String, default: "Free"},
  userStatus: { type: String, default: "Active" },
  createDate: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
});

// Pre-save middleware to assign userId before saving the document
userSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await User.countDocuments(); // Count existing users
    this.userId = count + 1; // Assign a new userId
  }
  next();
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
