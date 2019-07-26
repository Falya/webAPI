import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import './src/config/passport/index.mjs';
import api from './src/routes/api.mjs';
import admin from './src/routes/admin.mjs';
import http from 'http';
import socket from 'socket.io';

const app = express();
const serverHttp = http.Server(app);
const io = socket(serverHttp);

io.on('connection', socket => {
  console.log('a user is connected');
  socket.on('disconnect', () => {
    console.log('a user is disconnected');
  });
});

mongoose.Promise = global.Promise;
app.set('port', process.env.PORT || 5000);
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, dbName: process.env.DB_NAME }, err => {
  if (err) {
    return console.error(err);
  }
  console.log('Connected to DataBase.');
});
app.use(passport.initialize());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(function(req, res, next) {
  req.io = io;
  next();
});
app.use('/api', api);
app.use('/api/admin', admin);

const server = serverHttp.listen(app.get('port'), () => {
  console.log('server is running on port', server.address().port);
});
