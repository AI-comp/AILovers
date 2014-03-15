Game = require('./Game.coffee').Game

game = new Game 4

game.populateHeroines 10

while !game.isFinished()
  moves = []
  for playerIndex in [0 .. game.numPlayers - 1]
    moves[playerIndex] = []
    for _ in [0 .. game.turn]
      moves[playerIndex].push Math.floor(Math.random() * game.heroines.length)
  game.proceed moves

console.log game.getRanking()