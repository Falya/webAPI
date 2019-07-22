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
  const cities = await City.find().sort('city');

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

export async function getTheaters(params) {
  const { cityId } = params;
  const theatersQuery = MovieTheater.find();

  if (cityId) {
    theatersQuery.where({ city: cityId });
  }

  try {
    const theaters = await theatersQuery;
    return theaters;
  } catch (error) {
    return { success: false };
  }
}

export async function addMovieTheater(params) {
  const { cinemaName, city } = params;
  try {
    const theater = await MovieTheater.findOne({ cinemaName, city });
    if (theater) {
      console.log('theater: ', theater);
      return { success: false, message: messages.ADD_THEATER_FAILED };
    }

    const newTheater = new MovieTheater(params);
    const addedTheater = await newTheater.save();
    return {
      success: true,
      message: messages.ADD_THEATER_SUCCESS,
      addedTheater,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: messages.ADD_THEATER_FAILED };
  }
}

export async function getTheater(params) {
  const { theaterId } = params;
  try {
    const theater = await MovieTheater.findById(theaterId).populate('halls');
    return theater;
  } catch (error) {
    return { success: false };
  }
}

export async function addFeature(params) {
  const { theater, product, price } = params;

  try {
    const movietheater = await MovieTheater.findById(theater);
    const isNotDuplicate = !movietheater.features.some(
      feature => feature.product.toLowerCase() === product.toLowerCase()
    );
    if (isNotDuplicate) {
      await movietheater.update({ $push: { features: { product, price } } });
      return { success: true, message: messages.ADD_FEATURE_SUCCESS };
    } else {
      return { success: false, message: messages.ADD_FEATURE_FAILED };
    }
  } catch (error) {
    return { success: false, message: messages.ADD_FEATURE_FAILED };
  }
}

// export async function addMovieTheater(data) {
//   try {
//     const newHall = new Hall({
//       ...data,
//     });

//     return await newHall.save();
//   } catch (error) {
//     console.log(error);
//   }

//   return MovieTheater.findOne({ city: data.city })
//     .then(cityId => {
//       return new MovieTheater({
//         ...data,
//         city: cityId,
//       });
//     })
//     .then(theater => theater.save())
//     .catch(err => handleError(err));
// }

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
