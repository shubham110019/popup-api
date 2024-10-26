const express = require('express');
const router = express.Router();
const { modaldata, fetchModalData, updateModalTrash, deleteModal, analyticsEntryApi } = require('../controllers/popupController');


router.post('/modal', modaldata);

// Fetch modal data by userId only
router.get('/modal-data/:userId', fetchModalData);

// Fetch modal data by userId and popid (id)
router.get('/modal-data/:userId/:id', fetchModalData);

// Fetch modal data by userId and siteId
router.get('/modal-data/site/:userId/:siteId', fetchModalData);


router.put('/modal-data/', updateModalTrash);

router.put('/update-analytics/:popid', analyticsEntryApi);


analyticsEntryApi

// router.get('/profile', getUserByToken); 

// Delete a modal by popid
router.delete('/modal-data/:popid', deleteModal); 

module.exports = router;
