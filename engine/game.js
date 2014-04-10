(function () {

    var MersenneTwister = require('./mersenne-twister').MersenneTwister,
        _ = require('underscore');

    exports.Game = (function () {
        function Game(seed) {
            this.heroines = [];
            this.turn = 1;
            this.mt = new MersenneTwister(seed);
        }

        Game.prototype.initialize = function (numHeroes) {
            this.numHeroes = numHeroes;
            this.populateHeroines(numHeroes * 2.5);
        };

        Game.prototype.populateHeroines = function (numHeroines) {
            this.heroines = []
            for (var i = 0; i < numHeroines; i++) {
                this.heroines.push(new Heroine(Math.floor(this.mt.random() * 4) + 3, this.numHeroes));
            }
        };

        Game.prototype.isHoliday = function () {
            return this.turn % 2 === 0;
        };

        Game.prototype.processTurn = function (moves) {
            for (var i = 0; i < (this.isHoliday() ? 2 : 5) ; i++) {
                for (var heroIndex = 0; heroIndex < this.numHeroes; heroIndex++) {
                    var targetHeroineIndex = parseInt(moves[heroIndex][i]);
                    if (!(targetHeroineIndex >= 0 && targetHeroineIndex < this.heroines.length)) {
                        targetHeroineIndex = 0;
                    }
                    this.heroines[targetHeroineIndex].date(heroIndex, this.isHoliday());
                }
            }

            this.turn += 1;
        };

        Game.prototype.isFinished = function () {
            return this.turn > 10;
        };

        Game.prototype.getRanking = function () {
            var heroes = [];
            for (var index = 0; index < this.numHeroes; index++) {
                heroes.push(new Hero(index));
            }

            _.each(this.heroines, function (heroine) {
                for (var i = 0; i < 2; i++) {
                    var func = [Math.max, Math.min][i];
                    var targetHeroes = heroine.filterHeroesByScore(heroes, func);
                    _.each(targetHeroes, function (targetHero) {
                        targetHero.star += (i == 0 ? 1 : -1) * heroine.value;
                    });
                }
            });

            return heroes.slice(0).sort(Hero.compareTo).reverse();
        };

        Game.prototype.getStatus = function (playerIndex) {
            var text = "";

            if (this.isFinished()) {
                text += "-1" + "\n";
            } else {
                text += this.turn + "\n";
                text += [this.isHoliday() ? "H" : "W", this.numHeroes, this.heroines.length, playerIndex].join(" ") + "\n";
                for (var i = 0; i < this.heroines.length; i++) {
                    var heroine = this.heroines[i];
                    text += _.flatten([heroine.value, heroine.revealedScore, heroine.realScore[playerIndex]]).join(" ") + "\n";
                }
            }

            return text;
        };

        Game.prototype.getWinner = function () {
            var ranking = this.getRanking();
            if (ranking[0].star == ranking[1].star) {
                return "";
            } else {
                return ranking[0].index;
            }
        }

        return Game;
    })();

    var Hero = (function () {
        function Hero(index) {
            this.index = index;
            this.star = 0;
        }

        Hero.compareTo = function (self, other) {
            return self.star > other.star ? 1 : -1;
        };

        return Hero;
    })();

    var Heroine = (function () {
        function Heroine(value, numHeroes) {
            this.value = value;
            this.revealedScore = [];
            this.realScore = [];
            for (var i = 0; i < numHeroes; i++) {
                this.revealedScore.push(0);
                this.realScore.push(0);
            }
        }

        Heroine.prototype.date = function (heroIndex, isHoliday) {
            if (isHoliday) {
                this.realScore[heroIndex] += 2;
            } else {
                this.realScore[heroIndex] += 1;
                this.revealedScore[heroIndex] += 1;
            }
        };

        Heroine.prototype.filterHeroesByScore = function (heroes, func) {
            var targetScore = func.apply(null, this.realScore);
            var targetHeroes = [];
            _.each(heroes, function (hero) {
                if (this.realScore[hero.index] === targetScore) {
                    targetHeroes.push(hero);
                }
            }, this);
            return targetHeroes;
        };

        return Heroine;
    })();

}).call(this);
