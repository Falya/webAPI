export function filterSeancesByFeatures(seances, emptyAmount, hasEmptyVip, hasEmptyDouble) {
  let filterList = [];
  emptyAmount && filterList.push(emptySeatsFilter);
  hasEmptyVip && filterList.push(emptyVipFilter);
  hasEmptyDouble && filterList.push(emptyDoubleFilter);

  return filterList.reduce((acc, filter) => {
    acc = filter(acc, emptyAmount);
    return acc;
  }, seances);
}

function emptyVipFilter(seances, emptyAmount) {
  return seances.filter(seance => {
    let soldSeats = [];
    const emptySeats =
      seance.hallId.rows.reduce((sum, row) => {
        if (row.rowType === 'vip') {
          sum += row.rowLength;
          const currentRow = seance.soldSeats.filter(({ rowNumber }) => rowNumber === row.rowNumber);
          soldSeats = [...soldSeats, ...currentRow];
        }
        return sum;
      }, 0) - soldSeats.length;
    return emptySeats > emptyAmount;
  });
}

function emptyDoubleFilter(seances, emptyAmount) {
  return seances.filter(seance => {
    let soldSeats = [];
    const emptySeats =
      seance.hallId.rows.reduce((sum, row) => {
        if (row.rowType === 'double') {
          sum += row.rowLength;
          const currentRow = seance.soldSeats.filter(({ rowNumber }) => rowNumber === row.rowNumber);
          soldSeats = [...soldSeats, ...currentRow];
        }
        return sum;
      }, 0) - soldSeats.length;
    return emptySeats > emptyAmount;
  });
}

function emptySeatsFilter(seances, emptyAmount) {
  return seances.filter(seance => {
    const emptySeats =
      seance.hallId.rows.reduce((sum, row) => {
        sum += row.rowLength;
        return sum;
      }, 0) - seance.soldSeats.length;
    return emptySeats > emptyAmount;
  });
}
