export const genreQuery = (data) => {
  return $.ajax({
    method: "GET",
    url: 'api',
    data: data
  });
};

export const subGenreQuery = (data) => {
  localStorage.removeItem("subgenre");
  return $.ajax({
    method: "GET",
    url: "styleApi",
    data: data
  });
};
