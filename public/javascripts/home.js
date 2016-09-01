var onleaderboard = localStorage.getItem("onleaderboard");

if (onleaderboard && onleaderboard === 'true') {
  alert('yo! on leaderboard');
  localStorage.setItem("onleaderboard", false);
}
