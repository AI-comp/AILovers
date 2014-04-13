(function () {

    var MersenneTwister = require('./mersenne-twister').MersenneTwister,
        _ = require('underscore');

    exports.Game = (function () {
        function Game(seed) {
            this.heroines = [];
            this.turn = 1;
            this.mt = new MersenneTwister(seed);
        }

        Game.prototype.initialize = function (numPlayers) {
            this.numPlayers = numPlayers;
            this.populateHeroines(numPlayers * 2.5);
        };

        Game.prototype.populateHeroines = function (numHeroines) {
            this.heroines = []
            for (var i = 0; i < numHeroines; i++) {
                this.heroines.push(new Heroine(Math.floor(this.mt.random() * 4) + 3, this.numPlayers));
            }
        };

        Game.prototype.isHoliday = function () {
            return this.turn % 2 === 0;
        };

        Game.prototype.processTurn = function (moves) {
            for (var i = 0; i < (this.isHoliday() ? 2 : 5) ; i++) {
                for (var playerIndex = 0; playerIndex < this.numPlayers; playerIndex++) {
                    var targetHeroineIndex = parseInt(moves[playerIndex][i]);
                    if (!(targetHeroineIndex >= 0 && targetHeroineIndex < this.heroines.length)) {
                        targetHeroineIndex = 0;
                    }
                    this.heroines[targetHeroineIndex].date(playerIndex, this.isHoliday());
                }
            }

            this.turn += 1;
        };

        Game.prototype.isInitialState = function () {
            return this.turn == 1;
        };

        Game.prototype.isFinished = function () {
            return this.turn > 10;
        };

        Game.prototype.getInitialInformation = function () {
            var lines = [];

            lines.push([this.turn, this.numPlayers, this.heroines.length].join(' '));
            lines.push(_.map(this.heroines, function (heroine) {
                return heroine.enthusiasm;
            }).join(' '));

            return lines.join('\n') + '\n';
        };

        Game.prototype.getTurnInformation = function (playerIndex) {
            var lines = [];

            lines.push(this.turn);
            lines.push(this.isHoliday() ? 'H' : 'W');

            _.each(this.heroines, function (heroine) {
                var enemyIndices = _.reject(_.range(this.numPlayers), function (index) {
                    return index == playerIndex;
                });
                var enemyLove = _.map(enemyIndices, function (index) {
                    return heroine.revealedLove[index];
                });
                lines.push(_.flatten([heroine.revealedLove[playerIndex], enemyLove]).join(' '));
            }, this);

            lines.push(_.map(this.heroines, function (heroine) {
                return heroine.realLove[playerIndex];
            }).join(' '));

            return lines.join('\n') + '\n';
        };

        Game.prototype.getStatus = function () {
            var lines = [];

            lines.push('Real Love:');
            _.each(this.heroines, function (heroine) {
                lines.push(heroine.realLove.join(' '));
            });

            lines.push('Ranking:');
            _.each(this.getRanking(), function (player) {
                lines.push('Player ' + player.index + ': ' + player.popularity + ' popularity');
            });

            return lines.join('\n') + '\n';
        };

        Game.prototype.getTerminationText = function (playerIndex) {
            return '-1' + '\n';
        };

        Game.prototype.getRanking = function () {
            var players = [];
            for (var index = 0; index < this.numPlayers; index++) {
                players.push(new Player(index));
            }

            _.each(this.heroines, function (heroine) {
                for (var i = 0; i < 2; i++) {
                    var func = [Math.max, Math.min][i];
                    var targetHeroes = heroine.filterHeroesByLove(players, func);
                    _.each(targetHeroes, function (targetHero) {
                        targetHero.popularity += (i == 0 ? 1 : -1) * heroine.enthusiasm;
                    });
                }
            });

            return players.slice(0).sort(Player.compareTo).reverse();
        };

        Game.prototype.getWinner = function () {
            var ranking = this.getRanking();
            if (ranking[0].popularity == ranking[1].popularity) {
                return '';
            } else {
                return ranking[0].index;
            }
        }

        return Game;
    })();

    var Player = (function () {
        function Player(index) {
            this.index = index;
            this.popularity = 0;
        }

        Player.compareTo = function (self, other) {
            return self.popularity > other.popularity ? 1 : -1;
        };

        return Player;
    })();

    var Heroine = (function () {
        function Heroine(enthusiasm, numPlayers) {
            this.enthusiasm = enthusiasm;
            this.revealedLove = [];
            this.realLove = [];
            for (var i = 0; i < numPlayers; i++) {
                this.revealedLove.push(0);
                this.realLove.push(0);
            }
        }

        Heroine.prototype.date = function (playerIndex, isHoliday) {
            if (isHoliday) {
                this.realLove[playerIndex] += 2;
            } else {
                this.realLove[playerIndex] += 1;
                this.revealedLove[playerIndex] += 1;
            }
        };

        Heroine.prototype.filterHeroesByLove = function (players, func) {
            var targetLove = func.apply(null, this.realLove);
            var targetHeroes = [];
            _.each(players, function (player) {
                if (this.realLove[player.index] === targetLove) {
                    targetHeroes.push(player);
                }
            }, this);
            return targetHeroes;
        };

        return Heroine;
    })();

}).call(this);
