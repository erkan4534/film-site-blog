const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const { globalLimiter, authLimiter } = require('./middleware/rateLimiter');
const corsOptions = require('./config/corsConfig');
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes');
const filmRoutes = require('./routes/filmRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const postRoutes = require('./routes/postRoutes');
const historyRoutes = require('./routes/historyRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(logger);
app.use(globalLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  const swaggerUi = require('swagger-ui-express');
  const swaggerSpec = require('./config/swagger');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'Film Site Blog API Docs',
  }));
}

app.use('/api/auth',authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/films',  filmRoutes);
app.use('/api/categories',  categoryRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/payments', paymentRoutes);

app.use((req, res) => {
  res.status(404).send('Page not found!');
});

app.use(errorHandler);

module.exports = app;