var ReplayerScene = cc.Scene.extend({
    game: null,
    commands: null,

    ctor: function () {
        this._super();
    },

    getCurrentCommands: function () {
        return this.commands[this.game.turn - 1];
    },

    getCommand: function (playerIndex, commandIndex) {
        return this.getCurrentCommands()[playerIndex][commandIndex];
    },
});