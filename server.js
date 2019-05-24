const mongoose = require('mongoose');
const express = require('express');

const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();

const userSchema = new Schema({
  nickname: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  }
});

const User = mongoose.model("User", userSchema);

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
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  next();
});


app.get('/api/users/', (req, res) => {
  const { name, password } = req.query;
  const ip = req.connection.remoteAddress;
  console.log(req.query);
  User.find({nickname: name}, (err, user) => {
    if(err) {
      return console.log(err);
    }
    console.log(user);
    res.setHeader('Access-Control-Allow-Origin', ip);
    res.send('200');
  });
});
