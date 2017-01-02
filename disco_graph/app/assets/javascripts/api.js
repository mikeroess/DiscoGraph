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
  });
};
