const express = require('express');
const router = express.Router();
const { register, verifyOtp, login, getUserByToken, verifyToken } = require('../controllers/authController');


router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);

router.get('/user', getUserByToken);

// router.get('/profile', getUserByToken); 

module.exports = router;
