var Runner = require('./runner').Runner;
var args = process.argv.slice(2);
while (args.length < 4) {
    args.push("python engine/ai.py");
}
console.log(args);

var runner = new Runner(args);
runner.runGame(function() {
    console.log(JSON.stringify(runner.gameResult));
});
