(function () {

    var _ = require('underscore'),
        spawn = require('child_process').spawn,
        Game = require('../engine/game.js').Game;

    exports.Runner = (function () {
        function Runner() {
            this.gameResult = "";
        }

        Runner.prototype.runGame = function () {
            var game = new Game();
            game.initialize(4);

            var ais = [];
            for (var i = 0; i < 4; i++) {
                ais.push({
                    process: spawn('python', ['engine/ai.py']),
                    command: [],
                    ready: false,
                });
            }

            _.each(ais, function (ai) {
                ai.process.stdout.on('data', function (data) {
                    console.log('stdout: ' + data);
                    ai.command = data.toString().trim().split(' ');
                    ai.ready = true;
                });

                ai.process.stderr.on('data', function (data) {
                    console.log('stderr: ' + data);
                });

                ai.process.on('close', function (code) {
                    console.log('child process exited with code ' + code);
                });
            });

            this.doTurn(game, ais);
        };

        Runner.prototype.doTurn = function (game, ais) {
            if (game.isFinished()) {
                _.each(ais, function (ai) {
                    ai.process.stdin.write('0\n');
                });

                this.gameResult += game.getRanking();
            } else {
                _.each(ais, function (ai) {
                    ai.ready = false;
                    ai.process.stdin.write('1\n');
                });

                var self = this;
                setTimeout(function () {
                    var commands = _.map(ais, function (ai) {
                        return ai.command;
                    });

                    game.processTurn(commands);
                    self.gameResult += game.getStatus();

                    self.doTurn(game, ais);
                }, 100);
            }
        };

        return Runner;
    })();

}).call(this);