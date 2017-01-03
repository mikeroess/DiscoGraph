var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendfile('../public/index.html');
});

router.get('/api', function(req, res, next) {
  const genre = req.query["genre"];
  const startYear = req.query["startYear"];
  const endYear = req.query["endYear"];
  const results = {};
  results[genre] = {};
  console.log(results)
  for (let i = startYear; i <= endYear; i++) {
    console.log(i);
    console.log(results);
    console.log(results[genre]);
    results[genre][i] = i;
  }
  res.send(results);
});

module.exports = router;
