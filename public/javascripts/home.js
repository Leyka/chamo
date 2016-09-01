var onleaderboard = localStorage.getItem("onleaderboard");
var messages = ["What a beast!", "gg wp", "Congratz! :)", "The real masta!", "* Clap! Clap! *"];

if (onleaderboard && onleaderboard === 'true') {
  var message = messages[Math.floor(Math.random() * messages.length)];
  alertify.logPosition("bottom right");
  alertify.delay(3500).success(message);
  localStorage.setItem("onleaderboard", false);
}
