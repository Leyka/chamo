var onleaderboard = localStorage.getItem("onleaderboard");

if (onleaderboard && onleaderboard === 'true') {
  //alert('yo! on leaderboard');
  alertify.logPosition("top right");
  alertify.delay(4000).success("Congratz! :)");
  localStorage.setItem("onleaderboard", false);
}
