const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
userId: { type: String },
sitename: { type: String },
domain: { type: String },
token: { type: String },
siteId: { type: String },
isVerified: { type: Boolean, default: true },
date: { type: Date, default: Date.now },
});

// Create the User model
const Website = mongoose.model('Website', userSchema);

module.exports = Website;
