var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db/leaderboard.db');
var moment = require('moment');
var ip;
/* GET home page and top 5 users scores */
router.get('/', function(req, res, next) {
  ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var query = "SELECT * FROM leaderboard ORDER BY time LIMIT 5";
  db.all(query, function(err, rows){
    // errors?
    if (err !== null) {
      next(err);
    }
    // render view
    else {
      res.render('index', { title: 'CHÂMO - Challenge Your Reactivity', scores:rows, ip:ip});
    }
  });
});
/* GET leaderboard page */
router.get('/leaderboard', function(req, res, next){
  ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var query = "SELECT * FROM leaderboard ORDER BY time";
  db.all(query, function(err, rows){
    if (err !== null) {
      next(err);
    }
    else {
      res.render('leaderboard', {title: 'Leaderboard', scores: rows, ip:ip});
    }
  });
});

/* GET play page */
router.get('/play', function(req, res, next) {
  res.render('play', { title: 'Play' });
});

/* Check if user's score can be on leaderboard */
router.post('/check', function(req, res, next) {
  // To refactor/Tempfix... Basically, we get a json object ex. {'615': ''}
  var time = parseInt(Object.keys(req.body)[0]);
  if (!time) {
    next();
  }

  var query = "SELECT COUNT(*) as count FROM leaderboard";
  db.get(query, function(err, row){
    // errors?
    if (err !== null) {
      console.log(err);
      next(err);
    }
    // If we have less than 5 entries in leaderboard, user has automatically a place on leaderboard as we can't compare yet.
    if (row.count < 5) {
      res.send(true);
    }
    else {
      // We compare user time with the 'least' great score among the 5 best score
      var query = "SELECT time from (SELECT  time from leaderboard ORDER BY time LIMIT 5) ORDER BY time desc";
      // 100 120 130 150 200 250 290
      // 190
      db.get(query, function(err, row){
        // errors?
        if (err !== null) {
          console.log(err);
          next(err);
        }
        else {
          res.send(time < row.time);
        }
      });
    }
  });
});

/* POST save user score in leaderboard */
router.post('/save', function(req, res, next) {
  // To refactor/Tempfix... After stringify we get '{ '{"name":"j","time":979}': '' }'
  // So we parse the first key which is '{"name":"j","time":979}' to json and get paramters (name and time)
  var data = JSON.parse(Object.keys(req.body)[0]);
  var name = data.name;
  var time = parseInt(data.time);
  if (!name) {
    name = "Anonymous";
  }
  var date = moment().format("MMM Do YYYY");
  ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  // Make sure to not save the same data
  var query = "SELECT * FROM leaderboard WHERE name=? AND time=? AND ip=?";
  db.get(query, name, time, ip, function(err, row){
    if (row === undefined) {
      var query = "INSERT INTO leaderboard (name,time,date,ip) VALUES(?,?,?,?)";
      db.run(query, name, time, date, ip, function(err){
        if (err !== null) {
          console.log(err);
          next(err);
        }
        else {
          console.log('saved!');
        }
      });
    }
    else {
      console.log("We won't add a new row, already exists.");
    }
    res.redirect('/');
  });

});

module.exports = router;
