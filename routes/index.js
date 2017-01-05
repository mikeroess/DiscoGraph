const request = require('superagent');
const express = require('express');
const async = require('async');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendfile('../public/index.html');
});

const requestOptions = (genre, startYear, endYear) => {
  let results = [];
  let data;

  for (let i = startYear; i <= endYear; i++) {
    data = {'genre': genre, year: i};
    results.push(data);
  }
  return data;
};


router.get('/api', function(req, res, next) {
  const genre = req.query["genre"];
  // const startYear = req.query["startYear"];
  // const endYear = req.query["endYear"];
  // const reqOpts = requestOptions(genre, startYear, endYear);
  const year = req.query["year"];

  // results[genre] = {};
    const reqUri = `https://api.discogs.com/database/search?year=${year}&genre=${genre}&token=PjweRsihAfZimRUhZfXdCvpylIVkmjuEWFugyFbr&per_page=1&page=1`;
    request.get(reqUri)
      .set("User-Agent", "DiscoGraph/0.1 + https://mikeroess.github.io/DiscoGraph/")
      .then(function(response) {res.send(response);},
      function(err) {res.send(err);});

    // const reqCallback = (error, response, body) => {
    //   if (!error && response.statusCode == 200) {
    //     console.log("reqCallback");
    //     return JSON.parse(body)['pagination']['items'];
    //   } else {
    //   console.log(error);
    //   return error;
    // }};
    //
    // results[genre][optsHash["year"]] = request(reqOptions, reqCallback);
  //   callback();
  // }, function(err) {
  //   if (err)
  //     res.sendStatus(500);
  //   else
  //     console.log(results);
  //     res.send(results);
  // });

});

module.exports = router;
