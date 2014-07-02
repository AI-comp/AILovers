var MainScene = GameScene.extend({
    ctor: function (game) {
        this._super(game);

        this.sceneNode = ccs.sceneReader.createNodeWithSceneFile(res.json.mainScene);
        this.addChild(this.sceneNode);
        this.setupPanels();

        return true;
    },

    setupPlayerPanels: function () {
        this._super();
        _(this.game.getNumPlayers()).times(function (playerIndex) {
            var playerPanel = this.getPlayerPanel(playerIndex);
            playerPanel.setBackGroundImageScale9Enabled(true);
            playerPanel.setBackGroundImage(res.image.playerBackgrounds[playerIndex], ccui.Widget.LOCAL_TEXTURE);
        }, this);
    },
});
