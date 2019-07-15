export const hall = {
  hallName: 'Hall 2',
  movieTheaterId: '5cf4f047db586fdb90685b35',
  rows: [
    {
      rowNumber: 1,
      rowLength: 20,
      rowType: 'simple',
      price: 10,
    },
    {
      rowNumber: 2,
      rowLength: 20,
      rowType: 'simple',
      price: 10,
    },
    {
      rowNumber: 3,
      rowLength: 10,
      rowType: 'double',
      price: 20,
    },
    {
      rowNumber: 4,
      rowLength: 4,
      rowType: 'vip',
      price: 30,
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
