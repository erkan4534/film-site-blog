const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = require('./app.js');
const connectDB = require('./config/dbConfig.js');

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor!`);
});