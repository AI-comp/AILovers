var ReplayerScene = cc.Scene.extend({
    commands: null,
    heroineIds: null,
    backgroundIds: null,

    ctor: function () {
        this._super();
    },

    getCurrentCommands: function (game) {
        return this.getCurrentElement(this.commands, game);
    },

    getCommand: function (game, playerIndex, commandIndex) {
        return this.getElement(this.commands, game, playerIndex, commandIndex);
    },

    getBackgroundImage: function (game, playerIndex, commandIndex) {
        var backgroundId = this.getElement(this.backgroundIds, game, playerIndex, commandIndex);
        return res.image.date.backgrounds[backgroundId];
    },

    getCurrentElement: function (array, game) {
        return array[game.turn - 1];
    },

    getElement: function (array, game, playerIndex, commandIndex) {
        return this.getCurrentElement(array, game)[playerIndex][commandIndex];
    },

    getHeroineId: function (index) {
        return this.heroineIds[index];
    },

    getNextInformationScene: function (game) {
        if (game.isFinished()) {
            return new ResultScene(game);
        } else {
            return new MainScene(game);
        }
    },
});