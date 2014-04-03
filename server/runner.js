var _ = require('underscore'),
    spawn = require('child_process').spawn,
    Game = require('../engine/game.js').Game;

/**
 *
 * @param commands
 * @constructor
 */
function Runner(commands) {
    this.gameResult = {
        log: ""
        , result: ""
        , commands: []
    };
    this.commands = commands;
    this.n_survivors = 0;
    this.n_ready = 0;
}

/**
 * Sets up game, and runs it till completion
 * @param done
 */
Runner.prototype.runGame = function (done) {
    var game = new Game();
    game.initialize(4);
    this.n_survivors = 4;

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
            self.n_ready += 1;
            clearTimeout(ai.TO);
            onReady.call(self, game, ais, done);
        });

        ai.process.stderr.on('data', function (data) {
            console.log("AI" + ai.id + ">>" + 'stderr: ' + data);
        });

        ai.process.on('close', function (code) {
            console.log("AI" + ai.id + ">>" + 'child process exited with code ' + code);
        });
    });

    doTurn.call(this, game, ais, done);
};

/**
 * Post-turn handling, and set up of new turn processing
 * @param game
 * @param ais
 * @param done
 */
function onReady(game, ais, done) {
    if (this.n_ready == this.n_survivors) {
        console.log('Turn ended');
        var commands = _.map(ais, function (ai) {
            return ai.expired ? "" : ai.command;
        });

        game.processTurn(commands);
        this.gameResult.commands.push(commands);
        this.gameResult.log += game.getStatus();

        doTurn.call(this, game, ais, done);
    }
}

/**
 * Processes a turn
 * @param game
 * @param ais
 * @param done
 */
function doTurn(game, ais, done) {
    this.n_ready = 0;
    if (game.isFinished()) {
        _.each(ais, function (ai) {
            if (!ai.expired)
                ai.process.stdin.write('-1\n');
        });

        this.gameResult.result += game.getRanking();
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

                self.n_survivors -= 1;
                ai.process.kill('SIGINT');
                onReady.call(self, game, ais, done);
            }, 1000);
            ai.TO = TO;
        });
    }
};

exports.Runner = Runner;
