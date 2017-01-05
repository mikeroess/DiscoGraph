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
    const reqUri = `https://api.discogs.com/database/search?year=${year}&genre=${genre}&token=PjweRsihAfZimRUhZfXdCvpylIVkmjuEWFugyFbr&per_page=1&page=1`;
    request.get(reqUri)
      .set("User-Agent", "DiscoGraph/0.1 + https://mikeroess.github.io/DiscoGraph/")
      .then(function(response) {res.send(response);},
      function(err) {res.send(err);});
});

module.exports = router;
