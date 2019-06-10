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
  console.log('movieTheaterId: ', movieTheaterId);
  console.log('movieTheaterId TYPE: ', typeof movieTheaterId);

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
    if (!movieTheaterId) {
      const movieTheater = await MovieTheater.findById(movieTheaterId);
      const halls = movieTheater.halls.map(hall => hall._id);
      const seances = await Seance.find({ date: { $lte: today, $gte: nowTime }, movieName: movieId, hallId: { $in: halls } });
      if (seances.length) {
        const theater = Object.assign(movieTheater);
        theater.seances = seances.sort((a, b) => a.date > b.date);
        theaters.push(theater);
      }
    } else {
      const allSeances = await Seance.find({ movieName: movieId, date: { $lte: today, $gte: nowTime } });
      const movieTheaters = await MovieTheater.find({ city: city });

      const filteredTheaters = movieTheaters.reduce((theatersAcc, theater) => {
        const seances = theater.halls.reduce((acc, hall) => {
          allSeances.forEach(seance => {
            if (seance.hallId.toString() == hall._id.toString()) {
              acc.push(seance);
            }
          });
          return acc;
        }, []);

        if (seances.length) {
          const cinema = Object.assign(theater);
          cinema.seances = seances.sort((a, b) => a.date > b.date);
          theatersAcc.push(cinema);
        }

        return theatersAcc;
      }, []);

      theaters = [...filteredTheaters];
      console.log('theaters: ', theaters);
    }

    return theaters;
  } catch (error) {
    console.log(error)
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
    const movieTheaters =  MovieTheater.find();
    const dates = Seance.find({ date: { $lte: week, $gte: today } });

    if(cityId) {
      movieTheaters.where({city: cityId})
    } else {
      const defaultCity = await City.findOne({city: 'Minsk'});
      movieTheaters.where({city: defaultCity._id});
    }


    if (movieTheaterId) {
      const [theater] = await MovieTheater.where({_id: movieTheaterId});
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

    formatedDates = await dates.select('date').then(datesArr => {
      const datesMap = new Map();

      datesArr.forEach(seance => {
        const date = new Date(seance.date);
        date.setHours(0, 0, 0);
        datesMap.set(date.toLocaleDateString('en', { month: 'long', day: 'numeric', weekday: 'long' }), date);
      });

      return [...datesMap.entries()]
        .map(date => {
          return {
            date: date[1],
            fulldate: date[0]
          };
        })
        .sort((a, b) => a.date > b.date);
    });

    movieTheaters.select('cinemaName');

    return Promise.all([cities, movies, movieTheaters]).then(([cities, movies, movieTheaters]) => {
      return {
        cities,
        movies,
        movieTheaters,
        dates: formatedDates
      };
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {getMovie, getMovieSeances, getOptionsForFilters};
