const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    
    const conn = await mongoose.connect("mongodb+srv://erkan:xILDkInPk1PtCN2l@cluster0.s7cztiv.mongodb.net/?appName=Cluster0");
    console.log(`MongoDB bağlantısı başarılı: ${conn.connection.host}`);
  } catch (error) {
    console.log(`MongoDB bağlantısı başarısız: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
