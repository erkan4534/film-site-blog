const express = require('express');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsConfig');
const filmRoutes = require('./routes/filmRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const verifyJWT = require('./middleware/verifyJWT');

const app = express();

app.use(cors(corsOptions));
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/films',  filmRoutes);
app.use('/api/categories',  categoryRoutes);

app.use((req, res) => {
  res.status(404).send('Page not found!');
});

app.use(errorHandler);

module.exports = app;