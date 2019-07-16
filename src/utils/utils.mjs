export function filterSeancesByFeatures(features) {
  const { hasEmptyMoreOne, hasEmptyMoreTwo, hasEmptyVip, hasEmptyDouble } = features;
  const emptyAmount = hasEmptyMoreTwo ? 2 : hasEmptyMoreOne ? 1 : 0;
  const params = [
    {
      status: !!emptyAmount,
    },
    {
      rowType: 'vip',
      status: hasEmptyVip,
    },
    {
      rowType: 'double',
      status: hasEmptyDouble,
    },
  ];

  const filterList = params.filter(filter => filter.status === true).map(rowType => setFilter(rowType, emptyAmount));

  return seances => filterList.reduce((acc, filter) => filter(acc), seances);
}

export function video3dFilter(hasVideo3d, query) {
  hasVideo3d && query.where({ 'format.video': '3D' });
  return query;
}

function setFilter(rowType = null, emptyAmount) {
  return rowType ? emptyTypedFilter(rowType, emptyAmount) : emptySeatsFilter(emptyAmount);
}

function emptyTypedFilter(rowType, emptyAmount) {
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
    return seances.filter(seance => {
      const emptySeats = seance.hallId.rows.reduce((sum, row) => (sum += row.rowLength), 0) - seance.soldSeats.length;
      return emptySeats > emptyAmount;
    });
  };
}
