import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const citySchema = new Schema({
  city: {
    type: String,
    unique: true,
  },
});

const City = mongoose.model('cities', citySchema);

export default City;
