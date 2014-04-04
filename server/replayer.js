var _ = require('underscore'),
    Game = require('../engine/game.js').Game;

var args = process.argv.slice(2);
if (args.length < 1) {
	console.log("Please specify JSON string of commands to replay.");
}

console.log(args[0]);
var replay = JSON.parse(args[0]);

var game = new Game(replay.shift());
game.initialize(4);
_.each(replay, function (commands) {
	game.processTurn(commands);
	console.log(game.getStatus());
});
console.log(game.getRanking());