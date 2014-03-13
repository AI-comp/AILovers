class Player
  constructor: (@index) ->
    @star = 0
    @totalLoveScore = 0

  @compareTo: (self, other) ->
    if self.star == other.star
      if self.totalLoveScore > other.totalLoveScore then 1 else if self.totalLoveScore < other.totalLoveScore then -1 else 0
    else
      if self.star > other.star then 1 else -1

exports.Player = Player