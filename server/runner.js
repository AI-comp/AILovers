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
    this.onExit = function () { };

    var self = this;

    this.process.stdout.on('data', function (data) {
        self.addLog('AI' + self.index + '>>' + 'STDOUT: ' + data);
        self.onStdout(data);
    });

    this.process.stderr.on('data', function (data) {
        self.addLog('AI' + self.index + '>>' + 'STDERR: ' + data, self.index);
    });

    this.process.on('close', function (code) {
        self.addLog('AI' + self.index + '>>' + 'Child process exited with code ' + code);
        self.available = false;
        self.clearTimer();
        self.onExit();
    });
}

AI.prototype.setTimer = function (timeLimit) {
    var self = this;
    self.timeout = setTimeout(function () {
        self.addLog('AI' + self.index + '>>' + 'Killing due to TLE');
        self.available = false;
        self.process.kill('SIGINT');
        self.onExit();
    }, timeLimit);
};

AI.prototype.clearTimer = function () {
    clearTimeout(this.timeout);
    this.timeout = null;
};

/**
 *
 * @param commands
 * @param workingDirs
 * @constructor
 */
function Runner(commands, workingDirs) {
    this.commands = commands;
    this.workingDirs = workingDirs;
}

Runner.prototype.LOG_FOR_EVERYONE = -1;

/**
 * Sets up game, and runs it till completion
 * @param done
 */
Runner.prototype.runGame = function (done) {
    var self = this;

    var seed = new Date().getTime();
    this.game = new Game(seed);
    this.game.initialize();

    this.gameResult = {
        log: _.map(_.range(this.game.getNumPlayers()), function (i) {
            return '';
        }),
        winner: '',
        replay: {
            seed: seed,
            commands: [],
        },
    };

    this.ais = [];
    for (var i = 0; i < this.game.getNumPlayers() ; i++) {
        var commandAndParameters = this.commands[i].split(' ');
        var command = _.first(commandAndParameters);
        var parameters = _.rest(commandAndParameters);
        var workingDir = this.workingDirs ? this.workingDirs[i] : undefined;
        this.ais.push(new AI(command, parameters, workingDir, i, function (message, aiIndex) {
            addLog.call(self, message, aiIndex);
        }));
    }

    _.each(this.ais, function (ai) {
        ai.onStdout = function (data) {
            if (data.toString().trim().toLowerCase() == 'ready' && !ai.ready) {
                ai.ready = true;
                ai.clearTimer();
                onReadyForBeginning.call(self, done);
            }
        };
        ai.onExit = function () {
            onReadyForBeginning.call(self, done);
        }
        ai.setTimer(5000);
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
                    ai.clearTimer();
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
 * @param aiIndex
 */
function addLog(logMessage, aiIndex) {
    var targetAIs = (aiIndex === undefined || aiIndex == this.LOG_FOR_EVERYONE) ? _.range(this.game.getNumPlayers()) : [aiIndex];

    _.each(targetAIs, function (ai) {
        this.gameResult.log[ai] += logMessage;
        if (logMessage.slice(-1) != '\n') {
            this.gameResult.log[ai] += '\n';
        }
    }, this);
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
            ai.onExit = function () { };
            ai.setTimer(1000);
        }, this);

        this.gameResult.replay = this.game.getReplay();
        this.gameResult.winner = this.game.getWinner();
        addLog.call(this, 'Winner: ' + this.gameResult.winner);
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
                ai.onExit = function () {
                    onReady.call(self, done);
                };
                ai.setTimer(1000);
            }, this);
        }
    }
};

exports.Runner = Runner;
