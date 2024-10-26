const express = require('express');
const router = express.Router();
const { website, fetchModalData, deleteWebsite, fetchModalDataSiteId } = require('../controllers/websiteController');


router.post('/website', website);

router.get('/website/:userId', fetchModalData);

router.get('/websiteid/:siteId', fetchModalDataSiteId);

router.delete('/website/:id', deleteWebsite); 

// router.get('/profile', getUserByToken); 

module.exports = router;
