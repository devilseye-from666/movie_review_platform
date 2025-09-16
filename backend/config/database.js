const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB Atlas connection with additional options
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Retry for 5s before failing
      socketTimeoutMS: 45000,        // Close sockets after 45s of inactivity
      bufferCommands: false          // Optional: disable mongoose buffering
    });
    
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error('MongoDB Atlas connection error:', error.message);
    
    // Log specific connection errors
    if (error.message.includes('authentication failed')) {
      console.error('❌ Check your username and password in the connection string');
    } else if (error.message.includes('IP address')) {
      console.error('❌ Check your IP whitelist in MongoDB Atlas Network Access');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('❌ Check your internet connection and cluster URL');
    }
    
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected from MongoDB Atlas');
});

// Close connection on app termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 MongoDB Atlas connection closed through app termination');
  process.exit(0);
});

module.exports = connectDB;