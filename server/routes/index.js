const request = require('superagent');
const models = require('../models/index');

// const checkDatabase(genre, year) {
//   check database
//   if there return record
//   else return null
// }

// const updateDatabase(genre, year) {
//   updateDatabase
// }
// const setupDiscogsReq = (req) => {
//   const genre = req.query["genre"];
//   const year = req.query["year"];
//   const discogsApi = "pAERgxHLPQFHFDSgjsiQQbKzQnEoFuTQvGGlBcCO";
//   let token = null;
//   if (discogsApi) {
//     token = discogsApi;
//   } else {
//     token = process.env.discogsToken;
//   }
//   const reqUri = `https://api.discogs.com/database/search?year=${year}&genre=${genre}&token=${token}&per_page=1&page=1`;
//   return reqUri;
// };


module.exports = (app) => {
  app.get('/getAllGenres', (req, res) => {
    console.log(req);
    models.Genre.findAll({}).then(
      (genres) => res.json(genres),
      (err) => res.send(err)
    );
  });

  app.post('/createGenre', (req, res) => {
    console.log(req.body);
    models.Genre.create({
      title: req.body["title"]
    }).then(function(genre) {
      res.json(genre);
    },
    (err) => console.log(err));
    });
  };
