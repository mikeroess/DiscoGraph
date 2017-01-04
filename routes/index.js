const request = require('request');
const express = require('express');
// import each from 'async/each';
const router = express.Router();

const buildRequests = (genre, startYear, endYear) => {
  requests = []
  for (let i = startYear; i <= endYear; i++) {
    requestVals = {genre, startYear, endYear};
  requests.push(requestVals)
  }
  return requests;
}

const makeRequest = (requestOpts) => {
  const genre = requestOpts["genre"];
  const startYear = requestOpts["startYear"];
  const endYear = requestOpts["endYear"];
  const uri = `https://api.discogs.com/database/search?year=${i}&genre=${genre}&token=PjweRsihAfZimRUhZfXdCvpylIVkmjuEWFugyFbr&per_page=1&page=1`;
  const options = {
    url: uri,
    headers: {
      "User-Agent": "DiscoGraph/0.1 + https://mikeroess.github.io/DiscoGraph/"
    }
  };
  const callback = (error, response, body) => {
      if (!error && response.statusCode == 200) {
        console.log(results);
        results[genre][i] = JSON.parse(body)['pagination']['items'];
        console.log(results);
        localStorage.setItem("this", "that");
        return results;
  } else {
    console.log(error);
    console.log(response.statusCode);
  }
  };
  request(options, callback)
}



// console.log(options['url']);





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
  const apiCalls = buildRequests(genre, startYear, endYear);
  // for (let i = startYear; i <= endYear; i++) {
  //   async.each(apiCalls, function(item))
  //
  //
  //   const new_results = request(options, callback);
  //   console.log("newResults");
  //   console.log(new_results);
  // }
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
