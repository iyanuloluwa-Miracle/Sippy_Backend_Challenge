const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Don't connect if already connected
    if (mongoose.connection.readyState === 1) {
      return;
    }

    // In test environment, use mongodb-memory-server
    const mongoUri = process.env.NODE_ENV === 'test'
      ? process.env.MONGODB_URI
      : process.env.MONGODB_URI;

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // Add timeout
    });

    if (process.env.NODE_ENV !== 'test') {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Don't exit during tests
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    // For tests, just throw the error
    throw error;
  }
};

module.exports = connectDB;