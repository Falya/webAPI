import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const genreSchema = new Schema({
  city: {
    type: String,
    unique: true,
  },
});

const Genre = mongoose.model('genres', genreSchema);

export default Genre;
