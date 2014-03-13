class exports.Heroine
  constructor: (@value, numPlayers) ->
    @dateScore = (0 for _ in [1 .. numPlayers])
    @loveScore = (0 for _ in [1 .. numPlayers])

  date: (playerIndex) ->
    @dateScore[playerIndex] += 1
  
  updateLoveScore: () ->
    totalDateScore = (score for score in @dateScore).reduce (x, y) -> x + y
    for playerIndex in [0 .. @loveScore.length - 1]
      pureScore = @value * @dateScore[playerIndex]
      if pureScore > 0
        @loveScore[playerIndex] += pureScore / totalDateScore

  getBestPlayers: (players) ->
    maxScore = Math.max.apply null, @loveScore
    bestPlayers = []
    for player in players
      if @loveScore[player.index] == maxScore
        bestPlayers.push player
    bestPlayers
