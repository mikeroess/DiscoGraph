import { APIToken } from './secret.js';

export const GenreQuery = (genre, year) => {
  return $.ajax({
    method: "GET",
    headers: {
      "User-Agent": "DiscoGraph/0.1 + https://mikeroess.github.io/DiscoGraph/"
    },
    url: `https://api.discogs.com/database/search?year=${year}&genre=${genre}&token=${APIToken}&per_page=1&page=1`
  });
};
