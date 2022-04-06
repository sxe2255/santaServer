const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/auth');
const personalRoutes = require('./routes/personal');
const historyRoutes = require('./routes/history');
const keys = require('./config/keys'); 

const app = express();

mongoose.connect(keys.mongoURL)
    .then(()=>console.log('monodb connected'))
    .catch((err)=>{console.log(err)})
app.use(passport.initialize());
require('./middleware/passport')(passport);
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.use('/api/auth',authRoutes);
app.use('/api/personal',personalRoutes);
app.use('/api/history',historyRoutes);

module.exports = app;