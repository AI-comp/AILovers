var _ = require('underscore'),
    spawn = require('child_process').spawn,
    Game = require('../game/game.js').Game;

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
        log: '',
        winner: '',
        replay: {
            seed: new Date().getTime(),
            commands: [],
        },
    };
    this.commands = commands;
    this.workingDirs = workingDirs;
    this.game = null;
    this.ais = [];
}

/**
 * Sets up game, and runs it till completion
 * @param done
 */
Runner.prototype.runGame = function (done) {
    var self = this;
    this.game = new Game(this.gameResult.replay.seed);
    this.game.initialize(4);

    self.ais = [];
    for (var i = 0; i < 4; i++) {
        var commandAndParameters = this.commands[i].split(' ');
        var command = _.first(commandAndParameters);
        var parameters = _.rest(commandAndParameters);
        var workingDir = this.workingDirs ? this.workingDirs[i] : undefined;
        self.ais.push(new AI(command, parameters, workingDir, i, function (message) {
            addLog.call(self, message);
        }));
    }

    _.each(self.ais, function (ai) {
        ai.onStdout = function (data) {
            if (data.toString().trim().toLowerCase() == 'ready' && !ai.ready) {
                ai.ready = true;
                clearTimeout(ai.timeout);
                onReadyForBeginning.call(self, done);
            }
        };
        ai.setTimer(5000, function () {
            onReadyForBeginning.call(self, done);
        });
    });
};

function onReadyForBeginning(done) {
    if (isEveryoneReady(this.ais)) {
        _.each(this.ais, function (ai) {
            var self = this;
            ai.onStdout = function (data) {
                if (ai.available && !ai.ready) {
                    ai.commands = data.toString().trim().split(' ');
                    ai.ready = true;
                    clearTimeout(ai.timeout);
                    onReady.call(self, done);
                }
            };
        }, this);

        processTurn.call(this, done);
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
 * @param done
 */
function onReady(done) {
    if (isEveryoneReady(this.ais)) {
        var commands = _.map(this.ais, function (ai) {
            return ai.available ? ai.commands : [];
        });
        this.game.processTurn(commands);
        this.gameResult.replay.commands.push(commands);
        addLog.call(this, 'Turn finished. Game status:');
        addLog.call(this, this.game.getStatus());
        addLog.call(this, '');

        processTurn.call(this, done);
    }
}

/**
 * Processes a turn
 * @param done
 */
function processTurn(done) {
    var availableAIs = _.filter(this.ais, function (ai) {
        return ai.available;
    });

    if (this.game.isFinished()) {
        addLog.call(this, 'Game finished');
        _.each(availableAIs, function (ai) {
            var terminationText = this.game.getTerminationText();
            if (terminationText) {
                ai.process.stdin.write(terminationText);
            }
        }, this);

        this.gameResult.winner = this.game.getWinner();
        done();
    } else {
        addLog.call(this, 'Starting a new turn');
        if (_.isEmpty(availableAIs)) {
            onReady.call(this, done);
        } else {
            _.each(availableAIs, function (ai) {
                ai.ready = false;

                addLog.call(this, 'AI' + ai.index + '>>' + 'Writing to stdin, waiting for stdout');
                if (this.game.isInitialState()) {
                    var initialInformation = this.game.getInitialInformation();
                    ai.process.stdin.write(initialInformation);
                    addLog.call(this, initialInformation);
                }
                var turnInformation = this.game.getTurnInformation(ai.index);
                ai.process.stdin.write(turnInformation);
                addLog.call(this, turnInformation);

                var self = this;
                ai.setTimer(1000, function () {
                    onReady.call(self, done);
                });
            }, this);
        }
    }
};

exports.Runner = Runner;
