var onleaderboard = localStorage.getItem("onleaderboard");

if (onleaderboard && onleaderboard === 'true') {
  //alert('yo! on leaderboard');
  alertify.logPosition("bottom right");
  alertify.delay(3500).success("What a beast!");
  localStorage.setItem("onleaderboard", false);
}
