(function () {
  var Heroine = require('./Heroine.js').Heroine;
  var Player = require('./Player.js').Player;
  var _ = require('underscore');

  exports.Game = (function () {
    function Game(numPlayers) {
      this.numPlayers = numPlayers;
      this.heroines = [];
      this.turn = 0;
    }

    Game.prototype.addHeroine = function (value) {
      this.heroines.push(new Heroine(value, this.numPlayers));
    };

    Game.prototype.populateHeroines = function (numHeroines) {
      this.heroines = []
      for (var i = 0; i < numHeroines; i++) {
        this.heroines.push(new Heroine(Math.floor(Math.random() * 6) + 1, this.numPlayers));
      }
    };

    Game.prototype.proceed = function (moves) {
      this.turn += 1;

      for (var i = 0; i < this.turn; i++) {
        for (var playerIndex = 0; playerIndex < this.numPlayers; playerIndex++) {
          var targetHeroineIndex = moves[playerIndex][i];
          if (targetHeroineIndex < 0 || targetHeroineIndex >= this.heroines.length) {
            targetHeroineIndex = 0;
          }
          this.heroines[targetHeroineIndex].date(playerIndex);
        }
      }

      _.each(this.heroines, function (heroine) {
        heroine.updateLoveScore();
      });
    };

    Game.prototype.isFinished = function () {
      return this.turn === 10;
    };

    Game.prototype.getRanking = function () {
      var players = [];
      for (var index = 0; index < this.numPlayers; index++) {
        players.push(new Player(index));
      }

      _.each(this.heroines, function (heroine) {
        var bestPlayers = heroine.getBestPlayers(players);
        _.each(bestPlayers, function (bestPlayer) {
          bestPlayer.star += 1 / bestPlayers.length;
        });
      });

      _.each(players, function (player) {
        player.totalLoveScore = this.heroines.map(function (heroine) {
          return heroine.loveScore[player.index];
        }).reduce(function (x, y) {
          return x + y;
        });
      }, this);

      return players.slice(0).sort(Player.compareTo).reverse();
    };

    return Game;

  })();

}).call(this);
