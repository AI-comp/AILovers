(function () {
  var Game = require('./Game.js').Game;

  var game = new Game(4);
  game.populateHeroines(10);

  while (!game.isFinished()) {
    moves = [];
    for (playerIndex = 0; playerIndex < game.numPlayers; playerIndex++) {
      moves[playerIndex] = [];
      for (var i = 0; i <= game.turn; i++) {
        moves[playerIndex].push(Math.floor(Math.random() * game.heroines.length));
      }
    }
    game.proceed(moves);
  }

  console.log(game.getRanking());

}).call(this);
