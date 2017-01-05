const startYearUpdate = (year) => {
  $('#startYearDisplay').val(year);
  if (year >= $('#endYearDisplay').val()) {
    $('#endYear').val(parseInt(year) + 1);
    $('#endYearDisplay').val(parseInt(year) + 1);
  }
  writeGraph(localStorage, $('#startYearDisplay').val(), $('#endYearDisplay').val() )
};
