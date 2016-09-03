var messages = ["What a beast!", "gg wp", "Congratz! :)", "The real masta!", "* Clap! Clap! *"];

if (localStorage.getItem("ishacker") === 'true') {
  alertify.logPosition("top right");
  alertify.delay(3500).log("That's embarrassing. You're not supposed to be in the leaderboard.");
  localStorage.setItem("ishacker", false);
}
else if (localStorage.getItem("onleaderboard") === 'true') {
  var message = messages[Math.floor(Math.random() * messages.length)];
  alertify.logPosition("bottom right");
  alertify.delay(3500).success(message);
  localStorage.setItem("onleaderboard", false);
}
