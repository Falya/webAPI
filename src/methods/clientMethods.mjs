import MovieTheater from '../models/MovieTheater.mjs';
import Movie from '../models/Movie.mjs';
import City from '../models/City.mjs';
import Seance from '../models/Seance.mjs';
import BlockedSeats from '../models/BlockedSeats.mjs';
import User from '../models/User.mjs';
import messages from '../namedMessages/namedMessages.mjs';
import { filterSeancesByFeatures } from '../utils/utils.mjs';

export async function getMovie(id) {
  const movie = await Movie.findById(id);
  return movie;
}

export async function getMovies() {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0);

  try {
    const currentMovies = await Movie.find().where({
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    });

    const featureMovies = await Movie.find().where({
      startDate: { $gt: currentDate },
      endDate: { $gt: currentDate },
    });

    let movies = {
      currentMovies: [],
      featureMovies: [],
    };

    if (currentMovies) {
      movies.currentMovies = currentMovies;
    }

    if (featureMovies) {
      movies.featureMovies = featureMovies;
    }

    return { ...movies };
  } catch (error) {
    console.error(error);
  }
}

export async function getMovieSeances(params) {
  const { movieId, movieTheaterId, city, features, date } = params;
  const nowTime = new Date();
  const today = new Date(date);

  const { emptyMoreOne, emptyMoreTwo, hasEmptyVip, hasEmptyDouble, video3d } = features;

  const emptyAmount = emptyMoreTwo ? 2 : emptyMoreOne ? 1 : null;

  if (nowTime.getDate() !== today.getDate()) {
    nowTime.setDate(today.getDate());
    nowTime.setHours(0, 0, 0);
  }

  today.setHours(23, 59);

  let theaters = [];

  try {
    const movieTheaterQuery = MovieTheater.find();
    const seancesQuery = Seance.find({ date: { $lte: today, $gte: nowTime }, movieName: movieId }).sort('date');

    video3d && seancesQuery.where({ 'format.video': '3D' });

    if (movieTheaterId) {
      const [movieTheater] = await movieTheaterQuery.where({ _id: movieTheaterId });
      const seances = await seancesQuery.where({ hallId: { $in: movieTheater.halls } }).populate('hallId');

      if (seances.length) {
        const theater = Object.assign(movieTheater);

        theater.seances = filterSeancesByFeatures(seances, emptyAmount, hasEmptyVip, hasEmptyDouble);
        theaters.push(theater);
      }
    } else {
      const allSeances = await seancesQuery.populate('hallId');
      const movieTheaters = await movieTheaterQuery.where({ city });

      const filteredTheaters = movieTheaters.map(theater => {
        const seances = allSeances.filter(seance => {
          for (let i = 0; i < theater.halls.length; i++) {
            if (seance.hallId._id.toString() === theater.halls[i].toString()) {
              return true;
            }
          }
        });
        const customTheater = Object.assign(theater);
        customTheater.seances = filterSeancesByFeatures(seances, emptyAmount, hasEmptyVip, hasEmptyDouble);

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
  const today = new Date();
  const week = new Date();

  week.setHours(0);
  week.setDate(week.getDate() + 7);

  try {
    const movie = await Movie.findById(movieId);
    const movieStartDate = new Date(movie.startDate);
    movieStartDate.setHours(0, 0, 0);

    const dates = Seance.find();

    if (movieStartDate > today) {
      week.setMonth(movieStartDate.getMonth(), movieStartDate.getDate() + 7);
      dates.where({ date: { $lte: week, $gte: movieStartDate } });
    } else {
      dates.where({ date: { $lte: week, $gte: today } });
    }

    const cities = City.find();
    const movieTheaters = MovieTheater.find();

    if (cityId) {
      movieTheaters.where({ city: cityId });
    } else {
      const defaultCity = await City.findOne({ city: 'Minsk' });
      movieTheaters.where({ city: defaultCity._id });
    }

    if (movieTheaterId) {
      const [theater] = await MovieTheater.where({ _id: movieTheaterId });
      dates.where({ movieName: movieId, hallId: { $in: theater.halls } });
    } else {
      const cinemas = await movieTheaters;

      const halls = cinemas.reduce((acc, theater) => {
        const theaterHalls = theater.halls;
        acc = [...acc, ...theaterHalls];
        return acc;
      }, []);

      dates.where({ movieName: movieId, hallId: { $in: halls } }).populate('hallId');
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
  const seance = await Seance.findById(seanceId).populate('hallId');
  const movieTheater = await MovieTheater.findOne({ halls: seance.hallId }).select('-seances -halls');
  const nowTime = new Date();
  const blockedSeatsQuery = BlockedSeats.find({ seanceId }).where({ expireAt: { $gte: nowTime } });
  const blockedSeats = await blockedSeatsQuery;
  let blockedSeatsByUser = [];
  if (userId) {
    blockedSeatsByUser = await blockedSeatsQuery.where({ userId }).sort('expireAt');
  }
  movieTheater.halls = [seance.hallId];

  return {
    seance,
    cinemaInfo: movieTheater,
    blockedSeats,
    blockedSeatsByUser,
  };
}

export async function toBlockSeat(params) {
  const { seanceId, seat, row } = params;

  try {
    const blockedSeat = await BlockedSeats.findOne({ seanceId, seat, row });
    if (blockedSeat) {
      return { success: false, message: messages.BLOCK_SEAT_ALREADY_BLOCKED };
    }

    const newBlockedSeat = new BlockedSeats({ ...params });
    await newBlockedSeat.save();
    return { success: false, message: messages.BLOCK_SEAT_SUCCESS };
  } catch (error) {
    console.log(error);
    return { success: false, message: messages.BLOCK_SEAT_FAILED };
  }
}

export async function unBlockSeat(params) {
  const { seatId, userId } = params;
  try {
    await BlockedSeats.findOne({ _id: seatId, userId }).remove();

    return { success: true, message: messages.UNBLOCK_SEAT_SUCCESS };
  } catch (error) {
    console.error(error);
    return { success: false, message: messages.UNBLOCK_SEAT_FAILED };
  }
}

export async function compareOrder(params) {
  const { orderTickets, orderFeatures, userId } = params;

  const blockedSeatsId = orderTickets.map(({ _id }) => _id);

  try {
    const deleteSeats = BlockedSeats.deleteMany({ _id: { $in: blockedSeatsId } });

    const soldSeats = orderTickets.map(({ row, seat, userId }) => {
      return {
        userId,
        rowNumber: row,
        seatNumber: seat,
      };
    });

    const seanceId = orderTickets[0].seanceId;
    const updateSeance = Seance.findById(seanceId).updateOne({ $push: { soldSeats } });

    const userSeats = orderTickets.map(({ row, seat, seanceId, seatType, price }) => {
      return {
        seanceId,
        rowNumber: row,
        seatNumber: seat,
        seatType,
        price,
      };
    });

    const updateUser = User.findById(userId).update({ $push: { tickets: userSeats } });
    let userFeatures = {};

    if (orderFeatures.length) {
      userFeatures = {
        seanceId,
        products: orderFeatures.map(feature => {
          return {
            product: feature.product,
            amount: feature.amount,
          };
        }),
      };

      updateUser.update({ $push: { features: userFeatures } });
    }

    await Promise.all([deleteSeats, updateSeance, updateUser]);

    return {
      success: true,
      message: messages.PAYMENT_TICKETS_SUCCESS,
      order: {
        tickets: userSeats,
        features: userFeatures,
      },
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: messages.PAYMENT_TICKETS_FAILED };
  }
}

export async function getUserProfile(user) {
  try {
    const userQuery = User.findById(user._id)
      .populate({
        path: 'tickets.seanceId',
        populate: { path: 'movieName hallId', populate: { path: 'movieTheaterId', populate: { path: 'city' } } },
      })
      .select('tickets features -_id');
    const userInfo = await userQuery;

    const uniqueSeances = new Set();
    userInfo.tickets.forEach(ticket => uniqueSeances.add(ticket.seanceId));
    const grouped = [...uniqueSeances].map(seance => {
      let newSeance = {
        date: seance.date,
        format: seance.format,
        hallName: seance.hallName,
        movieInfo: {
          name: seance.movieName.name,
          poster: seance.movieName.poster,
        },
        movieTheaterInfo: {
          name: seance.hallId.movieTheaterId.cinemaName,
          address: seance.hallId.movieTheaterId.address,
          city: seance.hallId.movieTheaterId.city.city,
        },
        tickets: [],
        features: [],
      };

      newSeance.tickets = userInfo.tickets
        .filter(ticket => ticket.seanceId._id === seance._id)
        .map(({ buyingTime, price, rowNumber, seatNumber, seatType }) => {
          return { buyingTime, price, rowNumber, seatNumber, seatType };
        });
      newSeance.features = userInfo.features
        .filter(feature => feature.seanceId.toString() === seance._id.toString())
        .map(({ products }) => {
          return { products };
        });
      return newSeance;
    });
    return {
      userName: user.nickName,
      email: user.email,
      registredAt: user.registredAt,
      orders: grouped,
      bought: user.tickets.length,
      lastPurchase: user.tickets.length ? user.tickets[user.tickets.length - 1].buyingTime : null,
    };
  } catch (error) {
    return { success: false, messge: messages.USER_PROFILE_FAILED };
  }
}
