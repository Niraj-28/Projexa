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
    const superAdminEmail = 'admin@workarea.com';
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
      console.log('--- DB SEED: Created Super Admin (admin@workarea.com / admin123) ---');
    }

    // DB Migration: Normalize existing user roles to standard lowercase snake_case
    const users = await User.find({});
    let modifiedCount = 0;
    const normalizeRole = (role) => {
      if (!role) return 'employee';
      const key = String(role)
        .trim()
        .replace(/[_\s-]+/g, '')
        .toLowerCase();
      switch (key) {
        case 'superadmin':
          return 'super_admin';
        case 'admin':
        case 'companyadmin':
          return 'company_admin';
        case 'manager':
          return 'manager';
        case 'employee':
          return 'employee';
        default:
          return key;
      }
    };

    const rawUsers = await mongoose.connection.db.collection('users').find({}).toArray();
    for (const u of rawUsers) {
      const normalized = normalizeRole(u.role);
      if (u.role !== normalized) {
        await mongoose.connection.db.collection('users').updateOne(
          { _id: u._id },
          { $set: { role: normalized } }
        );
        modifiedCount++;
      }
    }
    if (modifiedCount > 0) {
      console.log(`--- DB MIGRATION: Normalized roles for ${modifiedCount} users ---`);
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Keeping server running for debugging...');
  }
};

module.exports = connectDB;
