const theater = {
  cinema_name: 'Rocket',
  city: 'Minsk',
  adress: 'Rokossovski str. 150a',
  halls: [
    {
      hall_name: 'Hall 1',
      rows: [
        {
          row_number: 1,
          seats: [
            {
              seat_type: 'simple',
              seat_number: 1
            },
            {
              seat_type: 'simple',
              seat_number: 2
            },
            {
              seat_type: 'simple',
              seat_number: 3
            },
            {
              seat_type: 'simple',
              seat_number: 4
            },
            {
              seat_type: 'simple',
              seat_number: 5
            },
            {
              seat_type: 'simple',
              seat_number: 6
            }
          ]
        }
      ]
    },
    {
      hall_name: 'Hall 2',
      rows: [
        {
          row_number: 2,
          seats: [
            {
              seat_type: 'simple',
              seat_number: 1
            },
            {
              seat_type: 'simple',
              seat_number: 2
            },
            {
              seat_type: 'simple',
              seat_number: 3
            },
            {
              seat_type: 'simple',
              seat_number: 4
            },
            {
              seat_type: 'simple',
              seat_number: 5
            },
            {
              seat_type: 'simple',
              seat_number: 6
            }
          ]
        }
      ]
    }
  ]
};

const seance = {
  movie_name: 'Avengers: Endgame',
  cinema: {
    name: 'Rocket',
    hall: 'Hall 2'
  },
  date: new Date('2019-06-01T22:30')
};

module.exports.theater = theater;
module.exports.seance = seance;
