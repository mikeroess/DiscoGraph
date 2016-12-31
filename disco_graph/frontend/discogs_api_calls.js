
export const GenreQuery = (data) => {
  return $.ajax({
    method: "GET",
    url: "api/genre",
    data: data
  });
};
