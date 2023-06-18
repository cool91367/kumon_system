const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const server = require('express')();
const bodyParser = require('body-parser')
const usersRouter = require('./routes/user_routes');
const reportRouter = require('./routes/report_routes');
const classRouter = require('./routes/class_routes');

server.use(cookieParser());
server.use(logger('dev'));
server.use(express.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true })); 
server.use(express.static('public'));
server.use('/user', usersRouter);
server.use('/report', reportRouter);
server.use('/class', classRouter);

// db connection
require('./db/mongodb_connection');

server.listen(8080);
console.log("server start on http://localhost/report_system.html")