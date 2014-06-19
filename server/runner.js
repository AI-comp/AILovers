var _ = require('underscore'),
    spawn = require('child_process').spawn,
    exec = require('child_process').exec,
    Game = require('../game/game.js').Game;

function AI(executionCommand, parameters, workingDir, pauseCommand, unpauseCommand, index, addLog) {
    this.process = spawn(executionCommand, parameters, { cwd: workingDir });
    this.pauseCommand = pauseCommand;
    this.unpauseCommand = unpauseCommand;
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
        self.onExit();
    });
}

AI.prototype.setTimer = function (timeLimit) {
    var self = this;
    self.clearTimer();
    self.timeout = setTimeout(function () {
        self.addLog('AI' + self.index + '>>' + 'Killing due to TLE');
        self.process.kill('SIGINT');
    }, timeLimit);
};

AI.prototype.clearTimer = function () {
    clearTimeout(this.timeout);
    this.timeout = null;
};

AI.prototype.pause = function () {
    if (this.pauseCommand) {
        exec(this.pauseCommand);
    }
};

AI.prototype.unpause = function () {
    if (this.unpauseCommand) {
        exec(this.unpauseCommand);
    }
};

function Runner(executionCommands, workingDirs, pauseCommands, unpauseCommands) {
    this.executionCommands = executionCommands;
    var defaultArray = _.map(executionCommands, function () {
        return undefined;
    });
    this.workingDirs = workingDirs || defaultArray;
    this.pauseCommands = pauseCommands || defaultArray;
    this.unpauseCommands = unpauseCommands || defaultArray;
}

Runner.LOG_FOR_EVERYONE = -1;

Runner.prototype.runGame = function (done) {
    var self = this;

    this.done = done;
    var seed = new Date().getTime();
    this.game = new Game(seed);
    this.game.initialize();

    this.gameResult = {
        log: [],
        winner: '',
        replay: {
            seed: seed,
            commands: [],
        },
    };

    this.ais = [];
    for (var i = 0; i < this.game.getNumPlayers() ; i++) {
        var commandAndParameters = this.executionCommands[i].split(' ');
        var command = _.first(commandAndParameters);
        var parameters = _.rest(commandAndParameters);
        this.ais.push(new AI(command, parameters, this.workingDirs[i], this.pauseCommands[i], this.unpauseCommands[i], i, function (message, aiIndex) {
            addLog.call(self, message, aiIndex);
        }));
    }

    _.each(this.ais, function (ai) {
        ai.onStdout = function (data) {
            if (data.toString().trim().toLowerCase() == 'ready' && !ai.ready) {
                ai.ready = true;
                ai.clearTimer();
                onReadyForBeginning.call(self);
            }
        };
        ai.onExit = function () {
            if (ai.available && !ai.ready) {
                onReadyForBeginning.call(self);
            }
            ai.available = false;
            ai.clearTimer();
        }
        ai.setTimer(5000);
    });
};

function onReadyForBeginning() {
    if (isEveryoneReady.call(this, this.ais)) {
        _.each(this.ais, function (ai) {
            var self = this;
            ai.onStdout = function (data) {
                if (ai.available && !ai.ready) {
                    ai.commands = data.toString().trim().split(' ');
                    ai.ready = true;
                    ai.clearTimer();
                    ai.pause();
                    onReady.call(self, ai);
                }
            };
            ai.onExit = function () {
                if (ai.available && !ai.ready) {
                    onReady.call(self, ai);
                }
                ai.available = false;
                ai.clearTimer();
            };
        }, this);

        pauseAIs.call(this);
        beginTurn.call(this);
    }
}

function isEveryoneReady(ais) {
    return _.isEmpty(getUnreadyAIs.call(this));
}

function addLog(logMessage, aiIndex) {
    if (aiIndex === undefined) {
        aiIndex = Runner.LOG_FOR_EVERYONE;
    }
    this.gameResult.log.push({ target: aiIndex, message: logMessage.trim() });
}

function onReady() {
    if (isEveryoneReady.call(this, this.ais)) {
        var commands = _.map(this.ais, function (ai) {
            return ai.available ? ai.commands : [];
        });
        this.game.processTurn(commands);
        addLog.call(this, 'Turn finished. Game status:');
        addLog.call(this, this.game.getStatus());
        addLog.call(this, '');

        if (this.game.isFinished()) {
            finish.call(this);
        } else {
            beginTurn.call(this);
        }
    } else {
        processNextAI.call(this);
    }
}

function beginTurn() {
    addLog.call(this, 'Starting a new turn');

    var availableAIs = getAvailableAIs.call(this);
    if (_.isEmpty(availableAIs)) {
        onReady.call(this);
    } else {
        _.each(availableAIs, function (ai) {
            ai.ready = false;
        }, this);
        processNextAI.call(this);
    }
}

function finish() {
    addLog.call(this, 'Game finished');

    unpauseAIs.call(this);
    _.each(getAvailableAIs.call(this), function (ai) {
        var terminationText = this.game.getTerminationText();
        if (terminationText) {
            ai.process.stdin.write(terminationText);
        }
        ai.onStdout = function () { };
        ai.onExit = function () { };
        ai.setTimer(1000);
    }, this);

    this.gameResult.replay = this.game.getReplay();
    this.gameResult.winner = this.game.getWinner();
    addLog.call(this, 'Winner: ' + this.gameResult.winner);
    this.done();
};

function getAvailableAIs() {
    return _.filter(this.ais, function (ai) {
        return ai.available;
    });
}

function getUnreadyAIs() {
    return _.filter(getAvailableAIs.call(this), function (ai) {
        return !ai.ready;
    });
}

function pauseAIs() {
    _.each(getAvailableAIs.call(this), function (ai) {
        ai.pause();
    }, this);
}

function unpauseAIs() {
    _.each(getAvailableAIs.call(this), function (ai) {
        ai.unpause();
    }, this);
}

function processNextAI() {
    var nextAI = _.first(getUnreadyAIs.call(this));

    addLog.call(this, 'AI' + nextAI.index + '>>' + 'Writing to stdin, waiting for stdout');
    if (this.game.isInitialState()) {
        var initialInformation = this.game.getInitialInformation();
        nextAI.process.stdin.write(initialInformation);
        addLog.call(this, initialInformation);
    }
    var turnInformation = this.game.getTurnInformation(nextAI.index);
    nextAI.process.stdin.write(turnInformation);
    addLog.call(this, turnInformation);

    nextAI.unpause();
    nextAI.setTimer(1000);
}

exports.Runner = Runner;
