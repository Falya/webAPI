import MovieTheater from '../models/MovieTheater.mjs';
import City from '../models/City.mjs';
import Seance from '../models/Seance.mjs';
import Movie from '../models/Movie.mjs';
import Hall from '../models/Hall.mjs';

/**
 *
 * @param {Object} data
 */
export async function addMovieTheater(data) {
  try {
    const newHall = new Hall({
      ...data,
    });

    return await newHall.save();
  } catch (error) {
    console.log(error);
  }

  //   return MovieTheater.findOne({ city: data.city })
  //     .then(cityId => {
  //       return new MovieTheater({
  //         ...data,
  //         city: cityId,
  //       });
  //     })
  //     .then(theater => theater.save())
  //     .catch(err => handleError(err));
}

function handleError(err) {
  console.log(err);
}

export async function addSeance(data) {
  try {
    const movie = await Movie.findOne({ name: data.movieName });
    const cinema = await MovieTheater.findOne({ cinemaName: data.cinema.name });

    const [{ id: hallId }] = cinema.halls.filter(hall => hall.hallName === data.cinema.hall);

    const newSeance = new Seance({
      movieName: movie.id,
      hallId,
      hallName: data.cinema.hall,
      date: data.date,
    });

    const seance = await newSeance.save();
    return seance;
  } catch (error) {
    handleError(error);
  }
}
