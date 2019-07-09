import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const blockedSeatsSchema = new Schema({
  seanceId: {
    type: Schema.Types.ObjectId,
    ref: 'seances',
    required: true,
  },
  row: {
    type: Number,
    required: true,
  },
  seat: {
    type: Number,
    required: true,
  },
  price: Number,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  seatType: String,
  expireAt: {
    type: Date,
    expires: 0,
  },
});

blockedSeatsSchema.pre('save', function(next) {
  const time = new Date();
  time.setMinutes(time.getMinutes() + 15);
  this.expireAt = time;
  next();
});

const BlockedSeats = mongoose.model('blockedSeats', blockedSeatsSchema, 'blockedSeats');

export default BlockedSeats;
