const genreColors = {
  "rock": "#8ce196",
  "pop": "steelblue",
  "hip-hop": "purple",
  "funk-soul": "orange",
  "electronic": "green",
  "classical": "brown",
  "jazz": "red",
  "subgenre": "black"
};

const genreButtonClick = function (genre, clicked, startYear, endYear) {
    let data = {'genre': genre, 'startYear': startYear, 'endYear': endYear};
    genreQuery(data).then(
      (response) => {
        localStorage.setItem(genre, JSON.stringify(response[genre]));
        writeGraph(localStorage, startYear, endYear);
      },
      (error) => console.log(error)
    );
  };


$("#mainForm").submit( (e) => {
  e.preventDefault();
  const data = {'sub_genre': $('#genre').val(), 'startYear': $('#startYear').val(), 'endYear': $('#endYear').val() };
  subGenreQuery(data);
  writeGraph(localStorage, data["startYear"], data["endYear"]);
});

const startYearUpdate = (year) => {
  $('#startYearDisplay').val(year);
  if (year >= $('#endYearDisplay').val()) {
    $('#endYear').val(parseInt(year) + 1);
    $('#endYearDisplay').val(parseInt(year) + 1);
  }
};

const endYearUpdate = (year) => {
  $('#endYearDisplay').val(year);
  if (year <= $('#startYearDisplay').val()) {
    $('#startYear').val(parseInt(year) - 1);
    $('#startYearDisplay').val(parseInt(year) - 1);
  }
};

const clearChart = () => {
  $(".graph").remove();
};

const isButtonClicked = (genre) => {
  const buttonId = genre + "-toggle";
  return document.getElementById(buttonId).checked;
};
