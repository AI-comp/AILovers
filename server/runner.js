var _ = require('underscore'),
    spawn = require('child_process').spawn,
    Game = require('./engine/game.js').Game;

/**
 *
 * @param commands
 * @param workingDirs
 * @constructor
 */
function Runner(commands, workingDirs) {
    this.gameResult = {
        log: ''
        , winner: ''
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
            addLog.call(self, 'AI' + ai.id + '>>' + 'STDOUT: ' + data);
            if (ai.available && !ai.ready) {
                ai.commands = data.toString().trim().split(' ');
                ai.ready = true;
                clearTimeout(ai.timeout);
                onReady.call(self, game, ais, done);
            }
        });

        ai.process.stderr.on('data', function (data) {
            addLog.call(self, 'AI' + ai.id + '>>' + 'STDERR: ' + data);
        });

        ai.process.on('close', function (code) {
            addLog.call(self, 'AI' + ai.id + '>>' + 'Child process exited with code ' + code);
        });
    });

    processTurn.call(this, game, ais, done);
};

/**
 * Add a game log message
 * @param logMessage
 */
function addLog(logMessage) {
    this.gameResult.log += logMessage;
    if (logMessage.slice(-1) != '\n') {
        this.gameResult.log += '\n';
    }
}

/**
 * Post-turn handling, and set up of new turn processing
 * @param game
 * @param ais
 * @param done
 */
function onReady(game, ais, done) {
    var availableAIs = _.filter(ais, function (ai) {
        return ai.available;
    });
    var notReadyAIs = _.filter(availableAIs, function (ai) {
        return !ai.ready;
    });
    if (_.isEmpty(notReadyAIs)) {
        var commands = _.map(ais, function (ai) {
            return ai.available ? ai.commands : [];
        });
        game.processTurn(commands);
        this.gameResult.replay.push(commands);
        addLog.call(this, 'Turn finished. Game status:');
        addLog.call(this, game.getStatus());
        addLog.call(this, '');

        processTurn.call(this, game, ais, done);
    }
}

/**
 * Processes a turn
 * @param game
 * @param ais
 * @param done
 */
function processTurn(game, ais, done) {
    var availableAIs = _.filter(ais, function (ai) {
        return ai.available;
    });

    if (game.isFinished()) {
        addLog.call(this, 'Game finished');
        _.each(availableAIs, function (ai) {
            var terminationText = game.getTerminationText();
            if (terminationText) {
                ai.process.stdin.write(terminationText);
            }
        });

        this.gameResult.winner = game.getWinner();
        done();
    } else {
        addLog.call(this, 'Starting a new turn');
        var self = this;
        if (_.isEmpty(availableAIs)) {
            onReady.call(self, game, ais, done);
        } else {
            _.each(availableAIs, function (ai) {
                ai.ready = false;

                addLog.call(self, 'AI' + ai.id + '>>' + 'Writing to stdin, waiting for stdout');
                if (game.isInitialState()) {
                    var initialInformation = game.getInitialInformation();
                    ai.process.stdin.write(initialInformation);
                    addLog.call(self, initialInformation);
                }
                var turnInformation = game.getTurnInformation(ai.id);
                ai.process.stdin.write(turnInformation);
                addLog.call(self, turnInformation);

                ai.timeout = setTimeout(function () {
                    addLog.call(self, 'AI' + ai.id + '>>' + 'Killing due to TLE');
                    ai.available = false;
                    ai.process.kill('SIGINT');
                    onReady.call(self, game, ais, done);
                }, 1000);
            });
        }
    }
};

exports.Runner = Runner;
