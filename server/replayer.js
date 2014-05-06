var _ = require('underscore'),
    Game = require('../game/game.js').Game;

var args = process.argv.slice(2);
if (args.length < 1) {
    console.error('Please specify JSON string of commands to replay.');
} else {
    console.warn('Playing ' + args[0]);
    var replay = JSON.parse(args[0]);

    var game = new Game(replay.seed);
    game.initialize(4);
    _.each(replay.commands, function (commands) {
        game.processTurn(commands);
        console.log(game.getStatus());
    });
    console.log(game.getResult());
}