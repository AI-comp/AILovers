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
    this.n_survivors = 0;
    this.n_ready = 0;
}

/**
 * Sets up game, and runs it till completion
 * @param done
 */
Runner.prototype.runGame = function (done) {
    var game = new Game(this.gameResult.replay[0]);
    game.initialize(4);
    this.n_survivors = 4;

    var ais = [];
    for (var i = 0; i < 4; i++) {
        var commandAndParameters = this.commands[i].split(' ');
        var command = _.first(commandAndParameters);
        var parameters = _.rest(commandAndParameters);
        var workingDir = this.workingDirs ? this.workingDirs[i] : undefined;
        ais.push({
            process: spawn(command, parameters, { cwd: workingDir }),
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
            self.addLog('AI' + ai.id + '>>' + 'stdout: ' + data);
            if (ai.expired)
                return;
            ai.command = data.toString().trim().split(' ');
            ai.ready = true;
            self.n_ready += 1;
            clearTimeout(ai.TO);
            onReady.call(self, game, ais, done);
        });

        ai.process.stderr.on('data', function (data) {
            self.addLog('AI' + ai.id + '>>' + 'stderr: ' + data);
        });

        ai.process.on('close', function (code) {
            self.addLog('AI' + ai.id + '>>' + 'child process exited with code ' + code);
        });
    });

    doTurn.call(this, game, ais, done);
};

Runner.prototype.addLog = function (logMessage) {
    this.gameResult.log += logMessage + '\n';
}

/**
 * Post-turn handling, and set up of new turn processing
 * @param game
 * @param ais
 * @param done
 */
function onReady(game, ais, done) {
    if (this.n_ready == this.n_survivors) {
        this.gameResult.log += 'Turn ended';
        var commands = _.map(ais, function (ai) {
            return ai.expired ? '' : ai.command;
        });

        game.processTurn(commands);
        this.gameResult.replay.push(commands);
        this.gameResult.content += game.getStatus();

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
                ai.process.stdin.write('-1' + '\n');
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
            self.addLog('AI' + ai.id + '>>' + 'writing to stdin, waiting for stdout');

            var TO = setTimeout(function () {
                self.addLog('AI' + ai.id + '>>' + 'killing due to TLE');
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
