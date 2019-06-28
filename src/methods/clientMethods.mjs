import MovieTheater from '../models/MovieTheater.mjs';
import Movie from '../models/Movie.mjs';
import City from '../models/City.mjs';
import Seance from '../models/Seance.mjs';
import BlockedSeats from '../models/BlockedSeats.mjs';

export async function getMovie(id) {
  const movie = await Movie.findById(id);
  return movie;
}

export async function getMovieSeances(params) {
  const { movieId, movieTheaterId, city, features, date } = params;
  const nowTime = new Date();
  const today = new Date(date);

  if (nowTime.getDate() !== today.getDate()) {
    const octal = parseInt('00');
    nowTime.setDate(today.getDate());
    nowTime.setHours(octal, octal, octal);
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
      const movieTheaters = await movieTheaterQuery.where({ city });

      const filteredTheaters = movieTheaters.map(theater => {
        const seances = allSeances.filter(seance => {
          for (let i = 0; i < theater.halls.length; i++) {
            if (seance.hallId.toString() === theater.halls[i]._id.toString()) {
              return true;
            }
          }
        });
        const customTheater = Object.assign(theater);
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

export async function getOptionsForFilters(params) {
  const { cityId, movieId, movieTheaterId } = params;
  const today = new Date().toISOString();
  const week = new Date();
  const octal = parseInt('00');

  week.setHours(octal);
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

    const formatedDates = await dates
      .select('date')
      .sort('date')
      .then(datesArr => {
        const datesMap = new Map();

        datesArr.forEach(seance => {
          const date = new Date(seance.date);
          date.setHours(0, 0, 0);
          datesMap.set(date.toLocaleDateString('en', { month: 'long', day: 'numeric', weekday: 'long' }), date);
        });

        return [...datesMap.entries()].map(date => ({
          date: date[1],
          fulldate: date[0],
        }));
      });

    movieTheaters.select('cinemaName');

    return Promise.all([cities, movies, movieTheaters]).then(([cities, movies, movieTheaters]) => ({
      cities,
      movies,
      movieTheaters,
      dates: formatedDates,
    }));
  } catch (error) {
    console.log(error);
  }
}

export async function getSeance(params) {
  const { seanceId, userId } = params;
  const seance = await Seance.findById(seanceId);
  const movieTheater = await MovieTheater.findOne(
    { 'halls._id': seance.hallId },
    { halls: { $elemMatch: { _id: seance.hallId } } }
  ).select('-seances');
  const nowTime = new Date();
  nowTime.toISOString();
  const blockedSeatsQuery = BlockedSeats.find({ seanceId }).where({ expireAt: { $gte: nowTime } });
  const blockedSeats = await blockedSeatsQuery;
  let blockedSeatsByUser = [];
  if (userId) {
    blockedSeatsByUser = await blockedSeatsQuery.where({ userId }).sort('expireAt');
    console.log(blockedSeatsByUser);
  }
  return {
    seance,
    cinemaInfo: movieTheater,
    blockedSeats,
    blockedSeatsByUser,
  };
}

export async function toBlockSeat(params) {
  const { seanceId, seat, row, userId } = params;

  try {
    const blockedSeat = await BlockedSeats.findOne({ seanceId, seat, row });
    if (blockedSeat) {
      return { success: false, message: 'seat is already blocked' };
    }

    const newBlockedSeat = new BlockedSeats({ ...params });
    await newBlockedSeat.save();
    return {
      success: true,
      message: 'seat is blocked',
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: 'seat is not blocked' };
  }
}

export async function unBlockSeat(params) {
  const { seatId, userId } = params;
  try {
    await BlockedSeats.findOne({ _id: seatId, userId }).remove();

    return { success: true, message: 'seat is unblocked' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'seat is not unblocked' };
  }
}
