import MovieTheater from '../models/MovieTheater.mjs';
import City from '../models/City.mjs';
import Seance from '../models/Seance.mjs';
import Movie from '../models/Movie.mjs';
import Hall from '../models/Hall.mjs';
import messages from '../namedMessages/namedMessages.mjs';
import Genre from '../models/Genre.mjs';

/**
 *
 * @param {Object} data
 */
export async function addMovie(data) {
  try {
    const isMovie = await Movie.findOne({ name: data.name });
    if (isMovie) {
      return {
        success: false,
        message: messages.ADD_MOVIE_ALREADY,
      };
    }

    const newMovie = new Movie({
      ...data,
    });
    await newMovie.save();

    return {
      success: true,
      message: messages.ADD_MOVIE_SUCCESS,
    };
  } catch (error) {
    return {
      success: false,
      message: messages.ADD_MOVIE_FAILED,
      error,
    };
  }
}

export async function getGenres() {
  const genres = await Genre.find()
    .select('-_id')
    .sort('name');

  return genres;
}

export async function getCities() {
  const cities = await City.find()
    .select('-_id')
    .sort('city');

  return cities;
}

export async function addCity(data) {
  try {
    const newCity = new City({
      ...data,
    });
    await newCity.save();

    return {
      success: true,
      message: messages.ADD_CITY_SUCCESS,
    };
  } catch (error) {
    return {
      success: false,
      message: messages.ADD_CITY_FAILED,
    };
  }
}

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
