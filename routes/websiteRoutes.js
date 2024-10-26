const express = require('express');
const router = express.Router();
const { website, fetchModalData } = require('../controllers/websiteController');


router.post('/website', website);

router.get('/website/:userId', fetchModalData);

// router.get('/profile', getUserByToken); 

module.exports = router;
