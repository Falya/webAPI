export function filterSeancesByFeatures(features) {
  const { minSeats } = features;
  const emptyAmount = minSeats || 0;
  const filters = {
    minSeats: emptySeatsFilter,
    seatType: emptyTypedFilter,
  };

  const filterList = Object.entries(features)
    .map(([key, value]) => {
      if (filters[key]) {
        return filters[key](emptyAmount, value);
      }
    })
    .filter(filter => filter);

  return seances => filterList.reduce((acc, filter) => (acc = filter(acc)), seances);
}

export function video3dFilter(hasVideo3d, query) {
  hasVideo3d && query.where({ 'format.video': '3D' });
  return query;
}

function emptyTypedFilter(emptyAmount, rowType) {
  return seances => {
    return seances.filter(seance => {
      const seatsSum = seance.hallId.rows.reduce(
        (sum, row) => {
          if (rowType && row.rowType === rowType) {
            sum.allSeats += row.rowLength;
            const currentRow = seance.soldSeats.filter(({ rowNumber }) => rowNumber === row.rowNumber);
            sum.soldSeats += currentRow.length;
          }
          return sum;
        },
        { soldSeats: 0, allSeats: 0 }
      );
      const emptySeats = seatsSum.allSeats - seatsSum.soldSeats;
      return emptySeats > emptyAmount;
    });
  };
}

function emptySeatsFilter(emptyAmount) {
  return seances => {
    const sean = seances.filter(seance => {
      const emptySeats = seance.hallId.rows.reduce((sum, row) => (sum += row.rowLength), 0) - seance.soldSeats.length;
      return emptySeats > emptyAmount;
    });
    console.log('sean: ', sean);
    return sean;
  };
}
