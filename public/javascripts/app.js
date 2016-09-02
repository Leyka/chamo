// Config
var timer = Math.floor(Math.random() * 5000) + 1000; // between 1s and 5s
var req = new XMLHttpRequest();
var canclick = false;
var clicked_earlier = false;
var clicked = false;
var now;
var user_time;
var in_leaderboard;

// DOM
var html = document.querySelector('html');
var h1 = document.querySelector('#main h1');
var body = document.querySelector('body');

sleep(timer).then(() => {
    if (clicked_earlier)
      return;

    // Start timer
    now = Date.now();
    canclick = true;
    body.style.backgroundColor = '#3D9970';
    h1.innerHTML= "CLICK NOW !";

    setTimeout(function(){
      if (!clicked) {
        document.querySelector('#gif').className="";
        h1.innerHTML= "CLICK N...OH WAIT..";
      }
    }, 2000);
});

// handle click
html.addEventListener('mousedown', function(e){
  var end = Date.now();

  if (clicked_earlier) {
    location.reload();
  }

  if (clicked) {
    return;
  }

  document.querySelector('#gif').className = "hidden";

  var score_div = document.querySelector('#score');

  if (!canclick) {
    clicked_earlier = true;
    score_div.className = 'hidden'; //add hidden class
    h1.innerHTML = "Oops! You clicked too earlier";
    body.style.backgroundColor = '#704dab';
    document.querySelector('.message').innerHTML = 'Click anywhere to play again';
  }
  else {
    clicked = true;
    score_div.className = ''; //remove hidden class
    user_time = end - now;
    if (user_time >= 2000) {
      h1.innerHTML = "zZz..You scored";
    }
    else {
      h1.innerHTML = "You scored";
    }
    document.querySelector(".result").innerHTML = user_time + "ms";

    // Check if user can be on leaderboard
    //var data = {time: user_time};
    // Ajax Post
    setAjaxPost(req, '/check', user_time);
    req.onload = function() {
      var success = req.status >= 200 && req.status < 400;
      if (success) {
        in_leaderboard = req.responseText;
        // User can register in leaderboard
        if (in_leaderboard === 'true') {
          document.querySelector('#save-leaderboard').className = 'save-leaderboard'; // We remove hidden class
        }
      } else {
        console.log('ajax check error');
      }
    };

    // Set cookies
    // Average
    var cookie_average = readCookie('average') == "" ? user_time : parseInt(readCookie('average'));
    var new_avg = Math.round((cookie_average+user_time)/2);
    setCookie('average', new_avg, 365);
    document.querySelector(".avg").innerHTML = new_avg;

    // Best score
    var best = readCookie('best') == "" ? user_time : readCookie('best');
    if (user_time <= best) {
      best = user_time;
      setCookie('best', best, 365);
      document.querySelector(".new-record").className = 'new-record';
    }
    document.querySelector(".best").innerHTML = best;

  }
});

var save_button = document.querySelector('.save');
save_button.addEventListener('click', function(){
    var data = {
      name: document.querySelector('#name').value,
      time: user_time
    };

    var can_save = in_leaderboard === 'true' && data.time;
    if (!can_save) {
      alertify.alert('Nice try folk!', function(){
        document.querySelector('.save-leaderboard').className = "hidden save-leaderboard";
      });
      return false;
    }

    setAjaxPost(req, '/save', JSON.stringify(data));
    req.onload = function() {
      var success = req.status >= 200 && req.status < 400;
      if (success) {
        // Redirect to home page and show a message that it has been saved
        localStorage.setItem("onleaderboard", true);
        var data = JSON.parse(req.responseText);
        localStorage.setItem("ishacker", data.hacker); // for fun :)
        window.location.href = data.redirect;
      }
    };
});
