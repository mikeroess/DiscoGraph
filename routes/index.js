const request = require('request');
const express = require('express');
const router = express.Router();

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
  for (let i = startYear; i <= endYear; i++) {
    // console.log("start first");
    // console.log(i);
    // console.log(genre);
    const uri = `https://api.discogs.com/database/search?year=${i}&genre=${genre}&token=PjweRsihAfZimRUhZfXdCvpylIVkmjuEWFugyFbr&per_page=1&page=1`;
    // console.log(uri);
    const options = {
      url: uri,
      headers: {
        "User-Agent": "DiscoGraph/0.1 + https://mikeroess.github.io/DiscoGraph/"
      }
    };
    // console.log(options['url']);
    const callback = (error, response, body) => {
        if (!error && response.statusCode == 200) {
          console.log(results);
          results[genre][i] = JSON.parse(body)['pagination']['items'];
          console.log(results);
          return results;
          // console.log()
          // console.log(body["pagination"]);
          // console.log(genre);
          // console.log(i);
    } else {
      console.log(error);
      console.log(response.statusCode);
    }
  };
    const new_results = request(options, callback);
    console.log("newResults");
    console.log(new_results);
  }
  //   $.ajax({
  //     method: "GET",
  //
  //     url:
  //   })
  //   .then((response) => {
  //     console.log(response)
  //     results[genre][i] = response["pagination"]["items"];
  //   },
  //   (err) => console.log(err));
  //   console.log("end first");
  // }
  res.send(results);
});

module.exports = router;
