var _ = require('underscore'),
    spawn = require('child_process').spawn,
    Game = require('../engine/game.js').Game;

/**
 *
 * @param commands
 * @param workingDirs
 * @constructor
 */
function Runner(commands, workingDirs) {
    this.gameResult = {
        log: ''
        , content: ''
        , result: ''
        , replay: [new Date().getTime()]
    };
    this.commands = commands;
    this.workingDirs = workingDirs;
}

/**
 * Sets up game, and runs it till completion
 * @param done
 */
Runner.prototype.runGame = function (done) {
    var game = new Game(this.gameResult.replay[0]);
    game.initialize(4);

    var ais = [];
    for (var i = 0; i < 4; i++) {
        var commandAndParameters = this.commands[i].split(' ');
        var command = _.first(commandAndParameters);
        var parameters = _.rest(commandAndParameters);
        var workingDir = this.workingDirs ? this.workingDirs[i] : undefined;
        ais.push({
            process: spawn(command, parameters, { cwd: workingDir }),
            commands: [],
            ready: false,
            available: true,
            timeout: null,
            id: i
        });
    }

    var self = this;
    _.each(ais, function (ai) {
        ai.process.stdout.on('data', function (data) {
            self.addLog('AI' + ai.id + '>>' + 'stdout: ' + data);
            if (ai.available) {
                ai.commands = data.toString().trim().split(' ');
                ai.ready = true;
                clearTimeout(ai.timeout);
                self.onReady(game, ais, done);
            }
        });

        ai.process.stderr.on('data', function (data) {
            self.addLog('AI' + ai.id + '>>' + 'stderr: ' + data);
        });

        ai.process.on('close', function (code) {
            self.addLog('AI' + ai.id + '>>' + 'child process exited with code ' + code);
        });
    });

    this.processTurn(game, ais, done);
};

/**
 * Add a game log message
 * @param logMessage
 */
Runner.prototype.addLog = function (logMessage) {
    this.gameResult.log += logMessage + '\n';
}

/**
 * Post-turn handling, and set up of new turn processing
 * @param game
 * @param ais
 * @param done
 */
Runner.prototype.onReady = function (game, ais, done) {
    var numReadyAIs = _.size(_.filter(ais, function (ai) {
        return ai.ready;
    }));
    var numAvailableAIs = _.size(_.filter(ais, function (ai) {
        return ai.available;
    }));
    if (numReadyAIs == numAvailableAIs) {
        var commands = _.map(ais, function (ai) {
            return ai.available ? ai.commands : [];
        });
        game.processTurn(commands);
        this.gameResult.replay.push(commands);
        this.gameResult.content += game.getStatus();
        this.addLog('Turn ended. Starting a new turn.');

        this.processTurn(game, ais, done);
    }
}

/**
 * Processes a turn
 * @param game
 * @param ais
 * @param done
 */
Runner.prototype.processTurn = function (game, ais, done) {
    var availableAIs = _.filter(ais, function (ai) {
        return ai.available;
    });

    if (game.isFinished()) {
        _.each(availableAIs, function (ai) {
            ai.process.stdin.write('-1' + '\n');
        });

        this.gameResult.result += game.getRanking();
        done();
    } else {
        var self = this;
        if (_.size(availableAIs) == 0) {
            self.onReady(game, ais, done);
        } else {
            _.each(availableAIs, function (ai) {
                ai.ready = false;
                ai.process.stdin.write(game.getStatusForAI(ai.id));
                self.addLog('AI' + ai.id + '>>' + 'writing to stdin, waiting for stdout');

                ai.timeout = setTimeout(function () {
                    self.addLog('AI' + ai.id + '>>' + 'killing due to TLE');
                    ai.available = false;
                    ai.process.kill('SIGINT');
                    self.onReady(game, ais, done);
                }, 1000);
            });
        }
    }
};

exports.Runner = Runner;
