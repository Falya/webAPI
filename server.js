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

// userSchema.static.findByLogin = async function (login) {
//   let user = await this.findOne({
//     nickname: login,
//   });

//   return user;
// };

const User = mongoose.model("User", userSchema);

// app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb+srv://root:root@cinemacluster-fmgmj.mongodb.net/test?retryWrites=true', {useNewUrlParser: true, dbName: 'CinemaDb'}, err => {
 if (err) {
  return console.log(err);
 }
 app.listen(process.env.PORT, () => {
   console.log(`Server is awaiting connection...`);

  //  mongoose.connection.db.listCollections().toArray(function (err, names) {
  //   console.log(names); // [{ name: 'dbname.myCollection' }]
  // });
 });
});

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  next();
});


app.get('/api/users/', (req, res) => {
  const { name, password } = req.query;
  console.log(req.query);
  User.find({nickname: name}, (err, user) => {
    if(err) {
      return console.log(err);
    }
    console.log(user);
    res.send('200');
  });
});
