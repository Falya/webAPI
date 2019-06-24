const MovieTheater = require('../models/MovieTheater');
const Movie = require('../models/Movie');
const City = require('../models/City');
const Seance = require('../models/Seance');

async function getMovie(id) {
  const movie = await Movie.findById(id);
  return movie;
}

async function getMovieSeances(params) {
  const { movieId, movieTheaterId, city, features, date } = params;
  const nowTime = new Date();
  const today = new Date(date);

  if (nowTime.getDate() !== today.getDate()) {
    nowTime.setDate(today.getDate());
    nowTime.setHours(00, 00, 00);
  }

  nowTime.toISOString();
  today.setHours(23, 59);
  today.toISOString();
  let theaters = [];

  try {
    const movieTheaterQuery = MovieTheater.find();
    const seancesQuery = Seance.find({ date: { $lte: today, $gte: nowTime }, movieName: movieId }).sort('date');

    if (movieTheaterId) {
      const [movieTheater] = await movieTheaterQuery.where({ _id: movieTheaterId });
      const halls = movieTheater.halls.map(hall => hall._id);
      const seances = await seancesQuery.where({ hallId: { $in: halls } });

      if (seances.length) {
        const theater = Object.assign(movieTheater);
        theater.seances = seances;
        theaters.push(theater);
      }
    } else {
      const allSeances = await seancesQuery;
      const movieTheaters = await movieTheaterQuery.where({ city: city });

      const filteredTheaters = movieTheaters.map(theater => {
        const seances = allSeances.filter(seance => {
          for (let i = 0; i < theater.halls.length; i++) {
            if (seance.hallId.toString() === theater.halls[i]._id.toString()) {
              return true;
            }
          }
        });
        let customTheater = Object.assign(theater);
        customTheater.seances = seances;

        return customTheater;
      });

      theaters = filteredTheaters.filter(({ seances }) => seances.length);
    }

    return theaters;
  } catch (error) {
    console.log(error);
  }
}

async function getOptionsForFilters(params) {
  const { cityId, movieId, movieTheaterId } = params;
  const today = new Date().toISOString();
  const week = new Date();

  week.setHours(00);
  week.setDate(week.getDate() + 7);
  week.toISOString();

  try {
    const cities = City.find();
    const movieTheaters = MovieTheater.find();
    const dates = Seance.find({ date: { $lte: week, $gte: today } });

    if (cityId) {
      movieTheaters.where({ city: cityId });
    } else {
      const defaultCity = await City.findOne({ city: 'Minsk' });
      movieTheaters.where({ city: defaultCity._id });
    }

    if (movieTheaterId) {
      const [theater] = await MovieTheater.where({ _id: movieTheaterId });
      const halls = theater.halls.map(hall => hall._id);
      dates.where({ movieName: movieId, hallId: { $in: halls } });
    } else {
      const cinemas = await movieTheaters;

      const halls = cinemas.reduce((acc, theater) => {
        const theaterHalls = theater.halls.map(hall => hall._id);
        acc = [...acc, ...theaterHalls];
        return acc;
      }, []);

      dates.where({ movieName: movieId, hallId: { $in: halls } });
    }

    const movies = Movie.find().select('_id name');

    formatedDates = await dates
      .select('date')
      .sort('date')
      .then(datesArr => {
        const datesMap = new Map();

        datesArr.forEach(seance => {
          const date = new Date(seance.date);
          date.setHours(0, 0, 0);
          datesMap.set(date.toLocaleDateString('en', { month: 'long', day: 'numeric', weekday: 'long' }), date);
        });

        return [...datesMap.entries()].map(date => {
          return {
            date: date[1],
            fulldate: date[0],
          };
        });
      });

    movieTheaters.select('cinemaName');

    return Promise.all([cities, movies, movieTheaters]).then(([cities, movies, movieTheaters]) => {
      return {
        cities,
        movies,
        movieTheaters,
        dates: formatedDates,
      };
    });
  } catch (error) {
    console.log(error);
  }
}

async function getSeance(params) {
  const { seanceId } = params;
  const seance = await Seance.findById(seanceId);
  const movieTheater = await MovieTheater.findOne(
    { 'halls._id': seance.hallId },
    { halls: { $elemMatch: { _id: seance.hallId } } }
  ).select('-seances');
  console.log('seance', seance);
  console.log('movieTheater', movieTheater);

  return {
    seance,
    cinemaInfo: movieTheater,
  };
}

module.exports = { getMovie, getMovieSeances, getOptionsForFilters, getSeance };
