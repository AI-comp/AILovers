var _ = require('underscore'),
    spawn = require('child_process').spawn,
    Game = require('../engine/game.js').Game;

function Runner() {
    function Runner(commands) {
        this.gameResult = "";
        this.commands = commands;
        console.log('Commands to run for:');
        console.log(this.commands);
    }
}

Runner.prototype.runGame = function (done) {
    var game = new Game();
    game.initialize(4);
    n_survivors = 4;

    var ais = [];
    for (var i = 0; i < 4; i++) {
        ais.push({
            process: spawn('python', ['engine/' + (i == 0 ? 'ai-tle' : 'ai') + '.py']),
            command: [],
            ready: false,
            expired: false,
            TO: null,
            id: i
        });
    }

    var self = this;
    _.each(ais, function (ai) {
        ai.process.stdout.on('data', function (data) {
            console.log("AI" + ai.id + ">>" + 'stdout: ' + data);
            if (ai.expired)
                return;
            ai.command = data.toString().trim().split(' ');
            ai.ready = true;
            n_ready += 1;
            clearTimeout(ai.TO);
            self.onReady(game, ais, done);
        });

        ai.process.stderr.on('data', function (data) {
            console.log("AI" + ai.id + ">>" + 'stderr: ' + data);
        });

        ai.process.on('close', function (code) {
            console.log("AI" + ai.id + ">>" + 'child process exited with code ' + code);
        });
    });

    this.doTurn(game, ais, done);
};

Runner.prototype.onReady = function (game, ais, done) {
    if (n_ready == n_survivors) {
        console.log('Turn ended');
        var commands = _.map(ais, function (ai) {
            return ai.expired ? "" : ai.command;
        });

        game.processTurn(commands);
        this.gameResult += game.getStatus();

        this.doTurn(game, ais, done);
    }
}

var n_survivors = 0;
var n_ready = 0;
Runner.prototype.doTurn = function (game, ais, done) {
    n_ready = 0;
    if (game.isFinished()) {
        _.each(ais, function (ai) {
            if (!ai.expired)
                ai.process.stdin.write('-1\n');
        });

        this.gameResult += game.getRanking();
        done();
    } else {
        var self = this;
        _.each(ais, function (ai) {
            if (ai.expired)
                return;
            ai.ready = false;
            ai.process.stdin.write(game.getStatusForAI(ai.id));
            console.log("AI" + ai.id + ">>" + 'writing 1 to stdin, waiting for stdout');

            var TO = setTimeout(function () {
                console.log("AI" + ai.id + ">>" + 'killing due to TLE');
                ai.expired = true;
                n_survivors -= 1;
                ai.process.kill('SIGINT');
                self.onReady(game, ais, done);
            }, 1000);
            ai.TO = TO;
        });
    }
};

exports.Runner = Runner;
