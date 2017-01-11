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
  if (year >= $('#endYearDisplay').val() - 5) {
    $('#endYear').val(parseInt(year) + 5);
    $('#endYearDisplay').val(parseInt(year) + 5);
  }
};

export const endYearUpdate = (year) => {
   $('#endYearDisplay').val(year);
   if (Number(year) <= Number($('#startYearDisplay').val()) + 5) {
     $('#startYear').val(parseInt(year) - 5);
     $('#startYearDisplay').val(parseInt(year) - 5);
   }
 };


export const addModal = () => {
   const aboutModal = document.getElementById("aboutModal");
   aboutModal.style.display = "block";
 };

export const removeModal = () => {
     const aboutModal = document.getElementById("aboutModal");
     aboutModal.style.display = "none";
 };

export const addTriviaModal = () => {
   const TriviaModal = document.getElementById("triviaModal");
   TriviaModal.style.display = "block";
   addTriviaSpinner();
   document.getElementById("triviaClose").style.display = "none";

 };

export const removeTriviaModal = () => {
     const TriviaModal = document.getElementById("triviaModal");
     TriviaModal.style.display = "none";
 };

export const allowTriviaClose = () => {
      const triviaSpinner = document.getElementById("triviaSpinner");
      const triviaClose = document.getElementById("triviaClose");
      triviaSpinner.style.display = "none";
      triviaClose.style.display = "block";
  };


export const removeAboutSpinner = () => {
  const aboutClose = document.getElementById("aboutclose");
  const aboutSpinner = document.getElementById("aboutSpinner");
  aboutClose.style.diplay = "none";
  aboutSpinner.style.diplay = "block";
};

export const addAboutSpinner = () => {
  const aboutClose = document.getElementById("aboutclose");
  const aboutSpinner = document.getElementById("aboutSpinner");
  aboutClose.style.diplay = "none";
  aboutSpinner.style.diplay = "block";
};

export const removeTriviaSpinner = () => {
  const triviaClose = document.getElementById("triviaclose");
  const triviaSpinner = document.getElementById("triviaSpinner");
  triviaClose.style.diplay = "none";
  triviaSpinner.style.diplay = "block";
};

export const addTriviaSpinner = () => {
  const closeTrivia = document.getElementById("triviaClose");
  const triviaSpinner = document.getElementById("triviaSpinner");
  closeTrivia.style.diplay = "none";
  triviaSpinner.style.diplay = "block";
};
