export const theater = {
  cinemaName: 'Salut',
  city: 'Minsk',
  adress: 'Rokossovski str. 150a',
  halls: [
    {
      hallName: 'Hall 1',
      rows: [
        {
          rowNumber: 1,
          rowLength: 20,
          rowType: 'simple',
        },
        {
          rowNumber: 2,
          rowLength: 20,
          rowType: 'simple',
        },
        {
          rowNumber: 3,
          rowLength: 20,
          rowType: 'simple',
        },
      ],
    },
    {
      hallName: 'Hall 2',
      rows: [
        {
          rowNumber: 1,
          rowLength: 20,
          rowType: 'simple',
        },
        {
          rowNumber: 2,
          rowLength: 10,
          rowType: 'double',
        },
      ],
    },
  ],
};

export const seance = {
  movieName: 'Avengers: Endgame',
  cinema: {
    name: 'Rocket',
    hall: 'Hall 2',
  },
  date: new Date('2019-06-09T15:30'),
};
