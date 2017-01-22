const request = require('superagent');
const models = require('../models/index');

module.exports = (app) => {
  app.get('/getAllGenres', (req, res) => {
    models.Genre.findAll({
    }).then(
      (genres) => res.json(genres),
      (err) => res.send(err)
    );
  });

  app.get('/checkGenre', (req, res) => {
    console.log("checkingGenre");
    models.Genre.findOne({
      where: {title: req.body['genre']}
    }).then(
      record => res.send(record),
      err => res.send(err)
    );
  });

  app.post('/createGenre', (req, res) => {
    models.Genre.create({
      title: req.body["title"]
    }).then(function(genre) {
      res.json(genre);
    },
    (err) => console.log(err));
    });

    app.post('/updateGenre', (req, res) => {
      const genre = req.body["title"];
      const year = req.body["year"];
      const releases = Number(req.body["releases"]);
      const newRecord = {};
      newRecord[year] = releases;
      models.Genre.update(
        newRecord,
        { where: {title: genre},
          returning: true
        }
      )
      .then((updatedRecord) => {
        res.send(updatedRecord);
      },
      (err) => console.log(err));
      });
  };
