var MainScene = InformationScene.extend({
    ctor: function (game) {
        this._super(game);
        return true;
    },

    createSceneNode: function () {
        return ccs.sceneReader.createNodeWithSceneFile(res.json.mainScene);
    },

    setupPlayerPanels: function () {
        this._super();

        _(this.game.getNumPlayers()).times(function (playerIndex) {
            var playerPanel = this.getPlayerPanel(playerIndex);
            playerPanel.setBackGroundImage(res.image.info.playerBackgrounds[playerIndex]);
        }, this);
    },
});
