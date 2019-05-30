const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const seanceSchema = new Schema({
  movie_name: {
    type: Schema.Types.ObjectId,
    ref: 'movies',
    required: true
  },
  hall_id: {
      type: Schema.Types.ObjectId,
      ref: 'movie_theaters.halls',
      required: true,
  },
  format: {
    video: {
      type: String,
      enum: ['2D', '3D'],
      default: '2D'
    },
    sound: {
      type: String,
      enum: ['Dolby Digital'],
      default: 'Dolby Digital',
    }
  },
  date: {
    type: Date,
    required: true
  },
});

seanceSchema.post('save', fn)

const Seance = mongoose.model("seances", seanceSchema);

module.exports = Seance;
