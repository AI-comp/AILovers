var _ = require('underscore'),
    Game = require('../engine/game.js').Game;

var args = process.argv.slice(2);
if (args.length < 1) {
	console.log("Please specify JSON string of commands to replay.");
}
var commandsList = JSON.parse(args[0]);

var game = new Game();
game.initialize(4);
_.each(commandsList, function (commands) {
	game.processTurn(commands);
	console.log(game.getStatus());
});
console.log(game.getRanking());
