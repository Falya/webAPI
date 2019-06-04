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
    .then(cityId => {
      return (movieTheater = new MovieTheater({
        ...data,
        city: cityId
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
    const movie = await Movie.findOne({ name: data.movieName });
    const cinema = await MovieTheater.findOne({ cinemaName: data.cinema.name });

    const [{ id: hallId }] = cinema.halls.filter(hall => hall.hallName === data.cinema.hall);

    const newSeance = new Seance({
      movieName: movie.id,
      hallId,
      hallName: data.cinema.hall,
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
