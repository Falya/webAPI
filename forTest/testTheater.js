const theater = {
  cinema_name: 'Salut',
  city: 'Minsk',
  adress: 'Rokossovski str. 150a',
  halls: [
    {
      hall_name: 'Hall 1',
      rows: [
        {
          row_number: 1,
          row_length: 20,
          row_type: 'simple'
        },
        {
          row_number: 2,
          row_length: 20,
          row_type: 'simple'
        },
        {
          row_number: 3,
          row_length: 20,
          row_type: 'simple'
        }
      ]
    },
    {
      hall_name: 'Hall 2',
      rows: [
        {
          row_number: 1,
          row_length: 20,
          row_type: 'simple'
        },
        {
          row_number: 2,
          row_length: 10,
          row_type: 'double'
        }
      ]
    }
  ]
};

const seance = {
  movie_name: 'Avengers: Endgame',
  cinema: {
    name: 'Salut',
    hall: 'Hall 1'
  },
  date: new Date('2019-06-01T22:30')
};

module.exports.theater = theater;
module.exports.seance = seance;
