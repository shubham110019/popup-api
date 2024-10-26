const Modal = require('../models/userPopup'); // Ensure correct model is used
const dotenv = require('dotenv');

dotenv.config();

exports.modaldata = async (req, res) => {
  try {
    const { userId, html, css, js, popid, campaignName, campaignType, status, siteId, divStructureStart, divStructureEnd, defaultCss, defaultJs } = req.body;

    if (!campaignName) {
      return res.status(400).json({ message: 'Please fill in the Campaign Name' });
    }

    // Create new modal/campaign entry
    const modal = new Modal({
      campaignType,
      campaignName,
      divStructureStart,
      divStructureEnd,
      defaultCss,
      defaultJs,
      siteId,
      userId,
      html,
      css,
      js,
      popid,
      status,
    });

    await modal.save();
    res.status(200).json({ message: 'Campaign created successfully' });
  } catch (error) {
    console.error('Error creating campaign:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.fetchModalData = async (req, res) => {
  try {
    const { userId, id, siteId } = req.params; // Get userId, id, and siteId from request parameters

    let query = {};

    if (id) {
      query = { popid: id }; // If `id` is provided, fetch by popid
    } else if (siteId) {
      query = { userId: userId, siteId: siteId }; // If `siteId` and `userId` are provided, fetch by both
    } else if (userId) {
      query = { userId: userId }; // If only `userId` is provided, fetch by userId
    }

    const modal = await Modal.find(query); // Fetch data based on query

    if (!modal || modal.length === 0) {
      return res.status(404).json({ message: 'Popup not found' });
    }

    res.status(200).json(modal); // Return the fetched data
  } catch (error) {
    console.error('Error fetching modal data:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




exports.updateModalTrash = async (req, res) => {
  try {
    const { popid, trash, archives, status, html, css, js, divStructureStart,
      divStructureEnd,
      defaultCss,
      defaultJs, } = req.body; 

    if (!popid) {
      return res.status(400).json({ message: 'Popid is required' });
    }

    // Create an object to hold the fields to be updated
    const updateFields = {
      ...(trash !== undefined && { trash }),
      ...(archives !== undefined && { archives }),
      ...(status !== undefined && { status }),
      ...(html !== undefined && { html }),
      ...(css !== undefined && { css }),
      ...(js !== undefined && { js }),
      ...(divStructureStart !== undefined && { divStructureStart }),
      ...(divStructureEnd !== undefined && { divStructureEnd }),
      ...(defaultCss !== undefined && { defaultCss }),
      ...(defaultJs !== undefined && { defaultJs })
    };

    // Check if any fields are provided to update
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'At least one field must be provided for update' });
    }

    // Find and update the modal by popid
    const updatedModal = await Modal.findOneAndUpdate(
      { popid },
      updateFields,
    );

    if (!updatedModal) {
      return res.status(404).json({ message: 'Popup not found' });
    }

    return res.status(200).json({ message: 'Popup updated successfully', updatedModal });
    
  } catch (error) {
    console.error('Error updating modal:', error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// exports.updateModalTrash = async (req, res) => {
//   try {
//     const {
//       popid,
//       trash,
//       archives,
//       status,
//       html,
//       css,
//       js,
//       divStructureStart,
//       divStructureEnd,
//       defaultCss,
//       defaultJs,
//       pageUrl, // Page URL for tracking visitors and conversions
//     } = req.body;

//     // Log the values for debugging
//     console.log('Popid:', popid);
//     console.log('Page URL:', pageUrl);

//     // Ensure popid is provided
//     if (!popid) {
//       return res.status(400).json({ message: 'Popid is required' });
//     }

//     // Create an object to hold the fields to be updated
//     const updateFields = {
//       ...(trash !== undefined && { trash }),
//       ...(archives !== undefined && { archives }),
//       ...(status !== undefined && { status }),
//       ...(html !== undefined && { html }),
//       ...(css !== undefined && { css }),
//       ...(js !== undefined && { js }),
//       ...(divStructureStart !== undefined && { divStructureStart }),
//       ...(divStructureEnd !== undefined && { divStructureEnd }),
//       ...(defaultCss !== undefined && { defaultCss }),
//       ...(defaultJs !== undefined && { defaultJs }),
//     };

//     // Check if any fields are provided to update
//     if (Object.keys(updateFields).length === 0) {
//       return res.status(400).json({ message: 'At least one field must be provided for update' });
//     }

//     // Find the modal by popid
//     const modal = await Modal.findOne({ popid });
//     if (!modal) {
//       return res.status(404).json({ message: 'Popup not found' });
//     }

//     // Update the analytics for the popup
//     let analyticsEntry = modal.analytics.find(entry => entry.pageUrl === pageUrl);
    
//     // Log the current analytics entries for debugging
//     console.log('Current Analytics Array:', modal.analytics);

//     if (analyticsEntry) {
//       // Update existing analytics entry
//       console.log('Updating existing analytics entry:', analyticsEntry);
//       analyticsEntry.conversions = (analyticsEntry.conversions || 0) + 1; // Increment conversions
//       analyticsEntry.visitors = (analyticsEntry.visitors || 0) + 1; // Increment visitors
//     } else {
//       // Create a new analytics entry if it doesn't exist
//       analyticsEntry = {
//         pageUrl: pageUrl,
//         visitors: 1, // Initial visitor count
//         conversions: 1, // Initial conversion count
//       };
//       modal.analytics.push(analyticsEntry); // Push the new entry into the array
//       console.log('Creating new analytics entry:', analyticsEntry);
//     }

//     // Update the modal fields
//     await Modal.findOneAndUpdate(
//       { popid },
//       updateFields,
//       { new: true } // Return the updated document
//     );

//     // Save the updated modal with new analytics
//     const savedModal = await modal.save();

//     console.log('Current Analytics after update:', savedModal.analytics);

//     return res.status(200).json({ message: 'Popup updated successfully', updatedModal: savedModal });

//   } catch (error) {
//     console.error('Error updating modal:', error.message);
//     return res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };



exports.deleteModal = async (req, res) => {
  try {
    const { popid } = req.params;

    if (!popid) {
      return res.status(400).json({ message: 'Popid is required' });
    }
    const deletedModal = await Modal.findOneAndDelete({ popid });

    if (!deletedModal) {
      return res.status(404).json({ message: 'Popup not found' });
    }

    return res.status(200).json({ message: 'Popup deleted successfully' });
  } catch (error) {
    console.error('Error deleting popup:', error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};




exports.analyticsEntryApi = async (req, res) => {

  const { pageUrl } = req.body; // Get the pageUrl from request body

  try {
    // Ensure pageUrl is provided
    if (!pageUrl) {
      return res.status(400).json({ message: 'Page URL is required' });
    }

    // Find user by popid
    const popAnalytics = await Modal.findOne({ popid: req.params.popid });

    console.log(popAnalytics);
    if (!popAnalytics) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check for existing analytics entry
    let analyticsEntry = popAnalytics.analytics.find(entry => entry.pageUrl === pageUrl);

    if (analyticsEntry) {
      // Update existing analytics entry
      analyticsEntry.conversions = (analyticsEntry.conversions || 0) + 1; // Increment conversions
      analyticsEntry.visitors = (analyticsEntry.visitors || 0) + 1; // Increment visitors
    } else {
      // Create a new analytics entry if it doesn't exist
      analyticsEntry = {
        pageUrl: pageUrl,
        visitors: 1, // Initial visitor count
        conversions: 1, // Initial conversion count
      };
      popAnalytics.analytics.push(analyticsEntry); // Push the new entry into the array
    }

    // Save the updated user with new analytics
    const updatedUser = await popAnalytics.save();

    return res.status(200).json({ message: 'Analytics updated successfully' });
  } catch (error) {
    console.error('Error updating analytics:', error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }


};