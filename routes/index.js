const discogsApi = require('./token.js');
const request = require('superagent');
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendfile('../public/index.html');
});

const setupDiscogsReq = (req) => {
  const genre = req.query["genre"];
  const year = req.query["year"];
  const discogsApi = "pAERgxHLPQFHFDSgjsiQQbKzQnEoFuTQvGGlBcCO";
  let token = null;
  if (discogsApi) {
    token = discogsApi;
  } else {
    token = process.env.discogsToken;
  }
  const reqUri = `https://api.discogs.com/database/search?year=${year}&genre=${genre}&token=${token}&per_page=1&page=1`;
  return reqUri;
};



router.get('/api', function(req, res, next) {
  const genre = req.query["genre"];
  const year = req.query["year"];
  const reqUri = setupDiscogsReq(req);
  request.get(reqUri)
    .set("User-Agent", "DiscoGraph/0.1 + https://mikeroess.github.io/DiscoGraph/")
    .then(
      (response) => {
        const items = response["body"]["pagination"]["items"];
        const newEntry = {};
        newEntry[genre] = {};
        newEntry[genre][year] = items;
        res.send(newEntry);
      },
      (err) => res.send(err)
    );
  // const genre = req.query["genre"];
  // const year = req.query["year"];
  // let token = null;
  // if (discogsApi) {
  //   token = discogsApi;
  // } else {
  //   token = process.env.discogsToken;
  // }
  //   const reqUri = `https://api.discogs.com/database/search?year=${year}&genre=${genre}&token=${token}&per_page=1&page=1`;
  //   request.get(reqUri)
  //     .set("User-Agent", "DiscoGraph/0.1 + https://mikeroess.github.io/DiscoGraph/")
  //     .then(function(response) {
  //       res.send(response);
  //     },
  //     function(err) {res.send(err);});
});


router.get('/styleApi', function(req, res, next) {
  const style = req.query["style"];
  const year = req.query["year"];
  let token = null;
  if (discogsApi) {
    token = discogsApi;
  } else {
    token = process.env.discogsToken;
  }
    const reqUri = `https://api.discogs.com/database/search?year=${year}&style=${style}&token=${token}&per_page=1&page=1`;
    request.get(reqUri)
      .set("User-Agent", "DiscoGraph/0.1 + https://mikeroess.github.io/DiscoGraph/")
      .then(function(response) {
        res.send(response);
      },
      function(err) {
        console.log(err)
        res.send(err);
      });
});


module.exports = router;
