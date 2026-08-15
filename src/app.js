const express = require('express');
const cors = require('cors');

const corsOptions = require('./config/corsConfig');

const filmRoutes = require('./routes/filmRoutes');

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/films', filmRoutes);

app.use((req, res) => {
  res.status(404).send('Page not found!');
});

module.exports = app;