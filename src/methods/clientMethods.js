const MovieTheater = require('../models/MovieTheater');
const Movie = require('../models/Movie');

async function getMovieSeances(movieId) {
  try {
    const movie = await Movie.findById(movieId);
    const allTheaters = await MovieTheater.find().populate({path: 'seances'});

    const theaters = allTheaters.reduce((acc, theater) => {
      const { seances } = theater;

      if (seances.length && seances.some(({ movieName }) => movieName == movieId)) {
        const filteredSeances = seances.filter(({ movieName }) => movieName == movieId);

        const filteredTheater = Object.assign(theater);
        filteredTheater.seances = filteredSeances;
        acc.push(filteredTheater);
      }
      return acc;
    }, []);

    return {
      movie,
      theaters
    };
  } catch (error) {
    console.log(error);
  }
}

module.exports.getMovieSeance = getMovieSeances;
