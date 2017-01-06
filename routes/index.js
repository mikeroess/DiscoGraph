const discogsApi = require('./token.js');
const request = require('superagent');
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendfile('../public/index.html');
});

router.get('/api', function(req, res, next) {
  const genre = req.query["genre"];
  const year = req.query["year"];
  let token = null;
  if (discogsApi) {
    token = discogsApi;
  } else {
    token = process.env.discogsToken;
  }
    const reqUri = `https://api.discogs.com/database/search?year=${year}&genre=${genre}&token=${token}&per_page=1&page=1`;
    request.get(reqUri)
      .set("User-Agent", "DiscoGraph/0.1 + https://mikeroess.github.io/DiscoGraph/")
      .then(function(response) {res.send(response);},
      function(err) {res.send(err);});
});

module.exports = router;
