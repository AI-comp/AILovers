Heroine = require('./Heroine.coffee').Heroine
Player = require('./Player.coffee').Player

class exports.Game
  constructor: (@numPlayers) ->
    @heroines = []
    @turn = 0

  addHeroine: (value) ->
    @heroines.push new Heroine value, @numPlayers

  populateHeroines: (numHeroines) ->
    @heroines = (new Heroine Math.floor(Math.random() * 6) + 1, @numPlayers for _ in [1 .. numHeroines])

  proceed: (moves) ->
    @turn += 1

    for i in [0 .. @turn - 1]
      for playerIndex in [0 .. @numPlayers - 1]
        targetHeroineIndex = moves[playerIndex][i]
        if targetHeroineIndex < 0 || targetHeroineIndex >= @heroines.length
          targetHeroineIndex = 0
        @heroines[targetHeroineIndex].date playerIndex

    for heroine in @heroines
      heroine.updateLoveScore()

  isFinished: () ->
    @turn == 10

  getRanking: () ->
    players = (new Player(index) for index in [0 .. @numPlayers - 1])

    for heroine in @heroines
      bestPlayers = heroine.getBestPlayers(players)
      for bestPlayer in bestPlayers
        bestPlayer.star += 1 / bestPlayers.length

    for player in players
      player.totalLoveScore = (heroine.loveScore[player.index] for heroine in @heroines).reduce (x, y) -> x + y
    
    players.slice(0).sort(Player.compareTo).reverse()
