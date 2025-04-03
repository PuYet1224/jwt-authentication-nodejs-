'use strict';
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors'); 

const app = express();

app.use(cors());

app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const accessRouter = require('./routes/access');
app.use('/api', accessRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message || 'Internal Server Error' });
});

module.exports = app;
