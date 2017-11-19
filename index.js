/**
 * Author:Kundan Kishor
 */
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/confusion';

const connect = mongoose.connect(url, {
    useMongoClient: true
});
connect.then((db) => {
    console.log("Connected to Mongo DB server");
}, (err) => {
    console.log(err);
});

const hostname = 'localhost';
const port = 3000;

const app = express();
app.use(morgan('dev'));

//Routing all /dishes to dishRouter
app.use('/dishes', dishRouter);
//Routing all /promotions to promoRouter
app.use('/promotions', promoRouter);
//Routing all /leadership to leaderRouter
app.use('/leaders', leaderRouter);

app.use(express.static(__dirname + '/public'));

app.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});