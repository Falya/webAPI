import { DB_CONFIG } from './src/config/config.mjs';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import './src/config/passport/index.mjs';
import api from './src/routes/api.mjs';

const app = express();

mongoose.Promise = global.Promise;

// app.set('port', process.env.PORT || 5000);
mongoose.connect(DB_CONFIG.connectionUrl, { useNewUrlParser: true, dbName: DB_CONFIG.dbName }, err => {
  if (err) {
    return console.log(err);
  }
  app.listen(app.get('port'), () => {
    console.log('Server is awaiting connection...');
  });
});
app.use(passport.initialize());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use('/api', api);
