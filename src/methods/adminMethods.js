const MovieTheater = require('../models/MovieTheater');
const City = require('../models/City');
const Seance = require('../models/Seance');
const Movie = require('../models/Movie');
/**
 *
 * @param {Object} data
 */
function addMovieTheater(data) {
  return City.findOne({ city: data.city })
    .then(city_id => {
      return (movieTheater = new MovieTheater({
        ...data,
        city: city_id
      }));
    })
    .then(theater => theater.save())
    .catch(err => handleError(err));
}

function handleError(err) {
  console.log(err);
}

async function addSeance(data) {
  try {
    const movie = await Movie.findOne({ name: data.movie_name });
    const cinema = await MovieTheater.findOne({ cinema_name: data.cinema.name });

    const [{ id: hall_id }] = cinema.halls.filter(hall => hall.hall_name === data.cinema.hall);

    const newSeance = new Seance({
      movie_name: movie.id,
      hall_id,
      hall_name: data.cinema.hall,
      date: data.date
    });

    const seance = await newSeance.save();
    return seance;

  } catch (error) {
    handleError(error);
  }
}

function handleError(err) {
  console.log(err);
}

module.exports.addMovieTheater = addMovieTheater;
module.exports.addSeance = addSeance;
