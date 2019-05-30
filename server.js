const mongoose = require('mongoose');
const express = require('express');
const User = require('./src/models/User');
const Movie = require('./src/models/Movie');
const { addMovieTheater, addSeance } = require('./src/methods/adminMethods');
const { getMovieSeance } = require('./src/methods/clientMethods')
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

app.get('/api/movies',(req, res) => {
  Movie.find({}, (err, movies) => {
    if(err) {
      return console.log(err);
    }
    res.send(movies);
  })
});

app.get('/api/movies/movie/seances/:id', (req, res) => {
   getMovieSeance(req.params.id)
    .then(data => {
      // console.log(data);
      res.send(data);
    })
    .catch(err => console.log(err));
});


/**Some querys for create testing */
app.get('/api/test-create/theater', (req, res) => {
const {theater} = require('./forTest/testTheater')
  addMovieTheater(theater)
    .then(result => res.send(result))
    .catch(err => console.log(err));
});

app.get('/api/test-create/seance', (req, res) => {
  const {seance} = require('./forTest/testTheater')
    addSeance(seance)
      .then(result => res.send(result))
      .catch(err => console.log(err));
  });
