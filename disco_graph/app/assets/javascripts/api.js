const genreQuery = (data) => {
  return $.ajax({
    method: "GET",
    url: "api/genreQuery",
    data: data
  });
};

const subGenreQuery = (data) => {
  localStorage.removeItem("subgenre");
  return $.ajax({
    method: "GET",
    url: "api/subGenreQuery",
    data: data
  }).then((response) => {
    const genre = Object.keys(response)[0];
    const releases = response[Object.keys(response)[0]];
    const tempObject = {};
    tempObject[genre] = releases;
    localStorage.setItem("subgenre", JSON.stringify(tempObject));
  },
(err) => console.log(err));
};
