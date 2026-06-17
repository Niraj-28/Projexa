const mongoose = require('mongoose');
const dns = require('dns');

// Force Google DNS to resolve MongoDB Atlas SRV records reliably
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Seed Super Admin if not already present
    const User = require('../models/User');
    const superAdminEmail = 'admin@projexa.com';
    const superAdminExists = await User.findOne({ email: superAdminEmail });
    if (!superAdminExists) {
      await User.create({
        name: 'Niraj Kotadiya',
        email: superAdminEmail,
        passwordHash: 'admin123', // Mongoose pre-save hook hashes this
        role: 'super_admin',
        isActive: true,
        status: 'Active',
      });
      console.log('--- DB SEED: Created Super Admin (admin@projexa.com / admin123) ---');
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Keeping server running for debugging...');
  }
};

module.exports = connectDB;
