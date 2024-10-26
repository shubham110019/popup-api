const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  campaignType: { type: String, default: 'popup' },
  campaignName: { type: String },
  siteId: { type: String },
  siteUrl: { type: String },
  userId: { type: String },
  html: { type: String },
  divStructureStart: {type: String},
  divStructureEnd: {type: String},
  defaultCss: { type: String },
  css: { type: String },
  js: { type: String },
  defaultJs: { type: String },
  popid: { type: String },
  status: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
  editdate: { type: Date, default: Date.now },
  trash: { type: Number, default: 0 },
  archives:{type: Boolean, default: false},
  pageUrl: { type: String },
  analytics: [{
    pageUrl: { type: String },
    visitors: { type: Number },
    conversions: { type: Number },
  }],
});

// Create the User model
const User = mongoose.model('Modal', userSchema);

module.exports = User;
