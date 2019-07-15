import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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
        default: Date.now,
      },
    },
  ],
});

userSchema.methods.generateHash = async function(password) {
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.genSalt(8, (err, salt) => {
      bcrypt.hash(password, salt, function(err, hash) {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });

  return hashedPassword;
};

userSchema.methods.validatePassword = async function(password) {
  const comparedPassword = await new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, function(err, res) {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
  return comparedPassword;
};

const User = mongoose.model('users', userSchema);

export default User;
