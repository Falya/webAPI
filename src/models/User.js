const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  nickName: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: String
});

const User = mongoose.model("users", userSchema);

module.exports = User;
