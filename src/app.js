const express = require('express');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const { globalLimiter, authLimiter } = require('./middleware/rateLimiter');
const corsOptions = require('./config/corsConfig');
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes');
const filmRoutes = require('./routes/filmRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(logger);
app.use(globalLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth',authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/films',  filmRoutes);
app.use('/api/categories',  categoryRoutes);

app.use((req, res) => {
  res.status(404).send('Page not found!');
});

app.use(errorHandler);

module.exports = app;