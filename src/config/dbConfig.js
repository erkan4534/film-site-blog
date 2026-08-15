const dns = require('dns');
const mongoose = require('mongoose');

// Windows'ta Node.js bazen 127.0.0.1 DNS kullanır; SRV sorgusu ECONNREFUSED olur.
dns.setServers(['8.8.8.8', '1.1.1.1']);
dns.setDefaultResultOrder('ipv4first');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/',
    );

    console.log(`MongoDB bağlantısı başarılı: ${conn.connection.host}`);
  } catch (error) {
    console.log(`MongoDB bağlantısı başarısız: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
