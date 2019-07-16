import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  nickName: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  registredAt: {
    type: Date,
    default: Date.now(),
  },
  tickets: [
    {
      rowNumber: Number,
      seatNumber: Number,
      price: Number,
      seatType: String,
      seanceId: {
        type: Schema.Types.ObjectId,
        ref: 'seances',
      },
      buyingTime: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  features: [
    {
      seanceId: {
        type: Schema.Types.ObjectId,
        ref: 'seances',
      },
      products: [
        {
          product: String,
          amount: Number,
        },
      ],
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
