var _ = require('underscore'),
    spawn = require('child_process').spawn,
    Game = require('./engine/game.js').Game;

function AI(command, parameters, workingDir, index, addLog) {
    this.process = spawn(command, parameters, { cwd: workingDir });
    this.index = index;
    this.addLog = addLog;
    this.commands = [];
    this.ready = false;
    this.available = true;
    this.timeout = null;
    this.onStdout = function (data) { };

    var self = this;

    this.process.stdout.on('data', function (data) {
        self.addLog('AI' + self.index + '>>' + 'STDOUT: ' + data);
        self.onStdout(data);
    });

    this.process.stderr.on('data', function (data) {
        self.addLog('AI' + self.index + '>>' + 'STDERR: ' + data);
    });

    this.process.on('close', function (code) {
        self.addLog('AI' + self.index + '>>' + 'Child process exited with code ' + code);
    });
}

AI.prototype.setTimer = function (timeLimit, onTLE) {
    var self = this;
    self.timeout = setTimeout(function () {
        self.addLog('AI' + self.index + '>>' + 'Killing due to TLE');
        self.available = false;
        self.process.kill('SIGINT');
        onTLE();
    }, timeLimit);
};

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
    var self = this;
    var game = new Game(this.gameResult.replay[0]);
    game.initialize(4);

    var ais = [];
    for (var i = 0; i < 4; i++) {
        var commandAndParameters = this.commands[i].split(' ');
        var command = _.first(commandAndParameters);
        var parameters = _.rest(commandAndParameters);
        var workingDir = this.workingDirs ? this.workingDirs[i] : undefined;
        ais.push(new AI(command, parameters, workingDir, i, function (message) {
            addLog.call(self, message);
        }));
    }

    _.each(ais, function (ai) {
        ai.onStdout = function (data) {
            if (data.toString().trim().toLowerCase() == 'ready' && !ai.ready) {
                ai.ready = true;
                clearTimeout(ai.timeout);
                onReadyForBeginning.call(self, game, ais, done);
            }
        };
        ai.setTimer(3000, function () {
            onReadyForBeginning.call(self, game, ais, done);
        });
    });
};

function onReadyForBeginning(game, ais, done) {
    if (isEveryoneReady(ais)) {
        var self = this;
        _.each(ais, function (ai) {
            ai.onStdout = function (data) {
                if (ai.available && !ai.ready) {
                    ai.commands = data.toString().trim().split(' ');
                    ai.ready = true;
                    clearTimeout(ai.timeout);
                    onReady.call(self, game, ais, done);
                }
            };
        });

        processTurn.call(this, game, ais, done);
    }
}

function isEveryoneReady(ais) {
    var availableAIs = _.filter(ais, function (ai) {
        return ai.available;
    });
    var notReadyAIs = _.filter(availableAIs, function (ai) {
        return !ai.ready;
    });
    return _.isEmpty(notReadyAIs);
}

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
    if (isEveryoneReady(ais)) {
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

                addLog.call(self, 'AI' + ai.index + '>>' + 'Writing to stdin, waiting for stdout');
                if (game.isInitialState()) {
                    var initialInformation = game.getInitialInformation();
                    ai.process.stdin.write(initialInformation);
                    addLog.call(self, initialInformation);
                }
                var turnInformation = game.getTurnInformation(ai.index);
                ai.process.stdin.write(turnInformation);
                addLog.call(self, turnInformation);

                ai.setTimer(1000, function () {
                    onReady.call(self, game, ais, done);
                });
            });
        }
    }
};

exports.Runner = Runner;
