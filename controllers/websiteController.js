const Website = require('../models/userWebsite');
const User = require('../models/userModel');
const dotenv = require('dotenv');

dotenv.config();

exports.website = async (req, res) => {
  try {
    const { userId, sitename, domain, token, siteId } = req.body;

    // Validate input fields
    if (!sitename) {
      return res.status(400).json({ message: 'Please fill in the sitename' });
    }

    if (!domain) {
      return res.status(400).json({ message: 'Please fill in the domain' });
    }

    // Check if userId is a valid format (adjust as necessary)
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Retrieve the user based on userId
    const user = await User.findOne({ userId: userId }); // Use findOne with userId

    console.log(user); // Log the user object for debugging

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check the user's plan type
    if (user.userPlanType === 'Free') {
      console.log('User has a Free plan.'); // Log for debugging

      const websiteCount = await Website.countDocuments({ userId: userId });

      if (websiteCount >= 1) {
        return res.status(400).json({ message: 'Free plan users can only add one website' });
      }
    }

    // Check if the website already exists
    let websiteLink = await Website.findOne({ domain });
    if (websiteLink) {
      return res.status(400).json({ message: 'This website already exists' });
    }

    // Create a new website entry
    websiteLink = new Website({
      userId,
      sitename,
      domain,
      token,
      siteId,
    });

    await websiteLink.save();
    console.log(`User saved to database: ${sitename} - ${domain}`);
    res.status(200).json({ message: 'Your website link has been saved' });
  } catch (error) {
    console.error('Your website link could not be saved:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Fetch modal data by user ID
exports.fetchModalData = async (req, res) => {
  try {
    const userId = req.params.userId; // Get user ID from request parameters

    const website = await Website.find({ userId: userId }); // Adjust your query according to your schema

    if (!website) {
      return res.status(404).json({ message: 'Website link not found' });
    }
  
    res.status(200).json(website);
  } catch (error) {
    console.error('Error fetching modal data:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// Fetch modal data by Site Id
exports.fetchModalDataSiteId = async (req, res) => {
  try {
    const siteId = req.params.siteId; // Get user ID from request parameters

    const website = await Website.find({ siteId: siteId }); // Adjust your query according to your schema
    if (!website) {
      return res.status(404).json({ message: 'Website link not found' });
    }
    res.status(200).json(website);
  } catch (error) {
    console.error('Error fetching modal data:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




// Delete website by _id
exports.deleteWebsite = async (req, res) => {
  try {
    const { id } = req.params;

    const website = await Website.findByIdAndDelete(id);

    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }
    res.status(200).json({ message: 'Website successfully deleted' });
  } catch (error) {
    console.error('Error deleting website:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};