const discogsApi = require('./token.js');
const request = require('superagent');
const express = require('express');
const router = express.Router();
const models = require('../server/models/index');

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


// YOU ARE IN CALLBACK HELL WITH PROMISES YOU DOLT
router.get('/api', function(req, res, next) {
  const genre = req.query["genre"];
  const year = req.query["year"];
  const whereCondition = {};
  whereCondition["title"] = genre;
  whereCondition[year] = {"$not": null};


  models.Genre.findOne({
    where: whereCondition
    })
    .then(
    (record) => {
      if (record === null) {
        const reqUri = setupDiscogsReq(req);
        request.get(reqUri)
        .set("User-Agent", "DiscoGraph/0.1 + https://mikeroess.github.io/DiscoGraph/")

        .then(
          (response) => {
            const newRecord = {};
            const items = response["body"]["pagination"]["items"];
            newRecord[year] = items;

            models.Genre.update(
              newRecord,
              { where: {title: genre},
                returning: true
              }
            )

            .then(
              (updatedRecord) => {
              const newEntry = {};
              console.log(`year is ${year}`);
              console.log(updatedRecord[1][0]["dataValues"][year]);
              newEntry[year] = updatedRecord[1][0]["dataValues"][year];
              res.send(newEntry);
            },
            (err) => console.log(err)
            );
          },
            (err) => console.log(err)
          );
      } else {
        const response = {};
        response[year] = record[year];
        res.send(response);
        }
      },
    (err) => console.log(err)
  );
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
