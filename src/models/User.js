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
  password: String,
  boughtSeats: [
    {
      rowNumber: Number,
      seatNumber: Number,
      seance: {
        type: Schema.Types.ObjectId,
        ref: 'seances',
      },
      buyingTime: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

const User = mongoose.model('users', userSchema);

module.exports = User;
