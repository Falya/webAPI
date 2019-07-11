export function filterSeancesByFeatures(seances, emptyAmount, hasEmptyVip, hasEmptyDouble) {
  let filteredSeances = seances;

  if (emptyAmount) {
    filteredSeances = seances.filter(seance => {
      const emptySeats =
        seance.hallId.rows.reduce((sum, row) => {
          sum += row.rowLength;
          return sum;
        }, 0) - seance.soldSeats.length;
      console.log('emptySeats: ', emptySeats);
      return emptySeats > emptyAmount;
    });
  }
  if (hasEmptyVip || hasEmptyDouble) {
    let typeFiltered = [];
    if (hasEmptyVip) {
      typeFiltered = seances.filter(seance => {
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
        return emptyAmount ? emptySeats > emptyAmount : emptySeats > 0;
      });
    }

    if (hasEmptyDouble) {
      typeFiltered = seances.filter(seance => {
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
        return emptyAmount ? emptySeats > emptyAmount : emptySeats > 0;
      });
    }

    filteredSeances = typeFiltered;
  }
  return filteredSeances;
}
