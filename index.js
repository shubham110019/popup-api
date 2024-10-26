const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors')
const authRoutes = require('./routes/authRoutes');

const popupRoutes = require('./routes/popupRoutes');
const websiteRoutes = require('./routes/websiteRoutes');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', popupRoutes);
app.use('/api', websiteRoutes);


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));


// Start server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
