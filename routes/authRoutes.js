const express = require('express');
const router = express.Router();
const { register, verifyOtp, login, getUserByToken, verifyToken, updateUser } = require('../controllers/authController');


router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);

router.get('/user', getUserByToken);


// PUT route to update user details
router.put('/user/update', updateUser);


module.exports = router;
