export const clearChart = () => {
  $(".graph").remove();
};

export const isButtonClicked = (genre) => {
  if( genre === "subgenre") return false;
  const buttonId = genre + "-toggle";
  return document.getElementById(buttonId).checked;
};

export const genreColors = {
  "rock": "#8ce196",
  "pop": "#5ED5FF",
  "hip-hop": "#FC78F5",
  "funk-soul": "#F0E95E",
  "electronic": "#AE73EE",
  "classical": "#FF5175",
  "jazz": "#00FFFF",
  "subgenre": "white"
};

export const setupLocalStorage = () => {
  localStorage.removeItem("subgenre");
  const genres = Object.keys(genreColors);
  genres.forEach( (genre) => {
    if (typeof(localStorage[genre]) === "undefined")
    localStorage.setItem(genre, JSON.stringify({}));
  });
  localStorage.setItem("subgenre", "{}");
};


export const startYearUpdate = (year) => {
  $('#startYearDisplay').val(year);
  if (year >= $('#endYearDisplay').val()) {
    $('#endYear').val(parseInt(year) + 5);
    $('#endYearDisplay').val(parseInt(year) + 5);
  }
};

export const endYearUpdate = (year) => {
   $('#endYearDisplay').val(year);
   if (year <= $('#startYearDisplay').val()) {
     $('#startYear').val(parseInt(year) - 5);
     $('#startYearDisplay').val(parseInt(year) - 5);
   }
 };
