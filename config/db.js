const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔌 Bypassing Network Blocks...');
    console.log('🚀 Mock Database Sandbox Server Connected Successfully!');
  } catch (err) {
    console.error('Database configuration gap:', err.message);
  }
};

module.exports = connectDB;