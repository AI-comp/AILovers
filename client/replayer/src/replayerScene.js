var ReplayerScene = cc.Scene.extend({
    commands: null,

    ctor: function () {
        this._super();
    },

    getCurrentCommands: function (game) {
        return this.commands[game.turn - 1];
    },

    getCommand: function (game, playerIndex, commandIndex) {
        return this.getCurrentCommands(game)[playerIndex][commandIndex];
    },
});