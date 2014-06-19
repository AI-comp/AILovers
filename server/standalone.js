var Runner = require('./runner').Runner,
    _ = require('underscore');
var argv = require('optimist')
    .string('a')
    .string('w')
    .string('p')
    .string('u')
    .argv;

var numAIs = 4;
var aiCommands = argv.a,
    workingDirs = argv.w,
    pauseCommands = argv.p,
    unpauseCommands = argv.u;
aiCommands = fixArgument(aiCommands, 'python ai/ai.py', numAIs);
workingDirs = fixArgument(workingDirs, '', numAIs);
pauseCommands = fixArgument(pauseCommands, '', numAIs);
unpauseCommands = fixArgument(unpauseCommands, '', numAIs);

console.warn('AI Commands: ' + JSON.stringify(aiCommands));
console.warn('Working Dirs: ' + JSON.stringify(workingDirs));

var runner = new Runner(aiCommands, workingDirs);
runner.runGame(function () {
    console.log(JSON.stringify(runner.gameResult));
});

function fixArgument(argument, defaultValue, numAIs) {
    if (!_.isArray(argument)) {
        fixedArgument = argument ? [argument] : [];
    }
    while (fixedArgument.length < numAIs) {
        fixedArgument.push(defaultValue);
    }
    return fixedArgument;
}
