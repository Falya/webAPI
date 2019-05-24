const mongoose = require('mongoose');
const express = require('express');
const User = require('./src/models/User');
const Movie = require('./src/models/Movie');
const app = express();
const jsonParser = express.json();



app.set('port', (process.env.PORT || 5000));

mongoose.connect('mongodb+srv://root:root@cinemacluster-fmgmj.mongodb.net/test?retryWrites=true', {useNewUrlParser: true, dbName: 'CinemaDb'}, err => {
 if (err) {
  return console.log(err);
 }
 app.listen(app.get('port'), () => {
   console.log(`Server is awaiting connection...`);
 });
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/api/users/', (req, res) => {
  const { name, password } = req.query;

  User.find({nickname: name}, (err, user) => {
    if(err) {
      return console.log(err);
    }
    res.send('200');
  });
});

app.get('/api/movies',(req, res) => {
  console.log(req.ip);
  Movie.find({}, (err, movies) => {
    if(err) {
      return console.log(err);
    }
    res.send(movies);
  })
});
