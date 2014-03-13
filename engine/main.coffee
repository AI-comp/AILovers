Game = require('./Game.coffee').Game

game = new Game(4)

for _ in [1 .. 10]
  game.addHeroine Math.floor(Math.random() * 6) + 1

while !game.isFinished()
  moves = []
  for playerIndex in [0 .. game.numPlayers]
    moves[playerIndex] = []
    for _ in [0 .. game.turn]
      moves[playerIndex].push Math.floor(Math.random() * game.heroines.length)
  game.proceed moves

console.log game.getRanking()