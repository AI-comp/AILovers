var Runner = require('./runner').Runner,
    _ = require('underscore');
var argv = require('optimist')
    .string('a')
    .string('w')
    .argv;

var numAIs = 4;
var aiCommands = argv.a,
    workingDirs = argv.w;
if (!_.isArray(aiCommands)) {
    aiCommands = aiCommands ? [aiCommands] : [];
}
if (!_.isArray(workingDirs)) {
    workingDirs = workingDirs ? [workingDirs] : [];
}
while (aiCommands.length < numAIs) {
    aiCommands.push('python ai/ai.py');
}
while (workingDirs.length < numAIs) {
    workingDirs.push('');
}
console.warn('AI Commands: ' + JSON.stringify(aiCommands));
console.warn('Working Dirs: ' + JSON.stringify(workingDirs));

var runner = new Runner(aiCommands, workingDirs);
runner.runGame(function () {
    console.log(JSON.stringify(runner.gameResult));
});
