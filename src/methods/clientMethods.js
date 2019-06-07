const MovieTheater = require('../models/MovieTheater');
const Movie = require('../models/Movie');
const City = require('../models/City');
const Seance = require('../models/Seance');

async function getMovie(id) {
  const movie = await Movie.findById(id);
  return movie;
}

async function getMovieSeances(params) {
  const { movieId, movieTheaterId, cityId, features, date } = params;
 console.log(date)
  const nowTime = new Date().toISOString();

  const today = new Date(date);


  today.setHours(23, 59);
  today.toISOString();
  console.log('nowTime: ', nowTime);
  console.log('today: ', today);
  let theaters = [];
  try {

    if (movieTheaterId !== 'All cinemas') {
      const movieTheater = await MovieTheater.findById(movieTheaterId);
      const halls = movieTheater.halls.map(hall => hall._id);
      const seances = await Seance.find({date: { $lte: today, $gte: nowTime},  movieName: movieId, hallId: { $in: halls }});
      const theater = Object.assign(movieTheater);
      theater.seances = seances;
      theaters.push(theater);

    } else {
      const allSeances = await Seance.find({movieName: movieId, date: { $lte: today, $gte: nowTime}});

      const movieTheaters = await MovieTheater.find({ city: cityId });

      const filteredTheaters = movieTheaters.map(theater => {
        const seances = theater.halls.reduce((acc, hall) => {
          console.log('hall: ', hall);
          const currentSeances = allSeances.map(seance => {
            console.log('seance: ', seance);
            if (seance.hallId == hall._id) {

              return seance;
            }
          });
          acc = [...acc, ...currentSeances];
          return acc;
        },[]);
        console.log(seances);
      });


    }


    ///////////////////////
    // const allTheaters = MovieTheater.find().populate({ path: 'seances' });

    // if(movieTheaterId !== 'All cinemas') {
    //   const theaters = await allTheaters.where({_id: movieTheaterId})
    // } else {
    //   const theaters = await allTheaters.reduce((acc, theater) => {
    //     const { seances } = theater;

    //     if (seances.length && seances.some(({ movieName }) => movieName == movieId)) {
    //       const filteredSeances = seances.filter(({ movieName }) => movieName == movieId);

    //       const filteredTheater = Object.assign(theater);
    //       filteredTheater.seances = filteredSeances;
    //       acc.push(filteredTheater);
    //     }
    //     return acc;
    //   }, []);
    // }



    return theaters;
  } catch (error) {
    console.log(error);
  }
}

async function getOptionsForFilters(cityId, movieId, movieTheaterId) {
  const today = new Date().toISOString();
  const week = new Date();

  week.setHours(00);
  week.setDate(week.getDate() + 7);
  week.toISOString();

  try {
    const movieTheaters = await MovieTheater.find({ city: cityId }).select('_id cinemaName halls');
    const dates = Seance.find({ date: { $lte: week, $gte: today } });

    if (movieTheaterId !== 'All cinemas') {
      const theater = await MovieTheater.findById(movieTheaterId).select('halls');
      const halls = theater.halls.map(hall => hall._id);

      dates.where({ movieName: movieId, hallId: { $in: halls } });
    } else {
      const halls = movieTheaters.reduce((acc, theater) => {
        const theaterHalls = theater.halls.map(hall => hall._id);
        acc = [...acc, ...theaterHalls];
        return acc;
      }, []);

      dates.where({ movieName: movieId, hallId: { $in: halls } });
    }

    const cities = City.find();
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

    return Promise.all([cities, movies]).then(([cities, movies]) => {
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

module.exports.getMovie = getMovie;
module.exports.getMovieSeance = getMovieSeances;
module.exports.getOptionsForFilters = getOptionsForFilters;
