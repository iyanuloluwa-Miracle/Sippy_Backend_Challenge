const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Don't connect if already connected (for tests)
    if (mongoose.connection.readyState === 1) {
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    if (process.env.NODE_ENV !== 'test') {
      console.log(`😂MongoDB Connected: ${conn.connection.host}`);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;