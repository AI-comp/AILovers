(function () {
  var _ = require('underscore');

  exports.Heroine = (function () {
    function Heroine(value, numPlayers) {
      this.value = value;
      this.dateScore = [];
      this.loveScore = [];
      for (var i = 0; i < numPlayers; i++) {
        this.dateScore.push(0);
        this.loveScore.push(0);
      }
    }

    Heroine.prototype.date = function (playerIndex) {
      this.dateScore[playerIndex] += 1;
    };

    Heroine.prototype.updateLoveScore = function () {
      totalDateScore = this.dateScore.reduce(function (x, y) {
        return x + y;
      });
      for (playerIndex = 0; playerIndex < this.loveScore.length; playerIndex++) {
        var pureScore = this.value * this.dateScore[playerIndex];
        if (pureScore > 0) {
          this.loveScore[playerIndex] += pureScore / totalDateScore;
        }
      }
    };

    Heroine.prototype.getBestPlayers = function (players) {
      var maxScore = Math.max.apply(null, this.loveScore);
      var bestPlayers = [];
      _.each(players, function (player) {
        if (this.loveScore[player.index] === maxScore) {
          bestPlayers.push(player);
        }
      }, this);
      return bestPlayers;
    };

    return Heroine;

  })();

}).call(this);
