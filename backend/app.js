require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const winston = require('winston');
const expressWinston = require('express-winston');
const { errors } = require('celebrate');

const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const { validateCreateUser, validateLogin } = require('./middlewares/validators');

const routes = require('./routes');

const {
  createUser,
  login,
} = require('./controllers/users');

const app = express();

const { PORT = 3000 } = process.env;

app.use(cors());

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/aroundb')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    // Keep the server running in development even if MongoDB is unavailable
  });

app.use(expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log' }),
  ],
  format: winston.format.json(),
}));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Servidor vai cair');
  }, 0);
});

app.post('/signin', validateLogin, login);

app.post('/signup', validateCreateUser, createUser);

app.use(auth);

app.use(routes);

app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Recurso solicitado nÃ£o encontrado',
  });
});

app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
}));

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
