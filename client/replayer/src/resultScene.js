var ResultScene = GameScene.extend({
    ctor: function (game) {
        this._super(game);

        this.sceneNode = ccs.sceneReader.createNodeWithSceneFile(res.json.resultScene);
        this.addChild(this.sceneNode);
        this.setupPanels();

        return true;
    },

    getLovePanelMode: function () {
        return GameScene.BAR_LOVE_PANEL_MODE;
    },

    setupPlayerPanels: function () {
        this._super();

        var rankedPlayers = this.game.getRanking();
        var maxPopularity = _.max(_.map(rankedPlayers, function (player) {
            return player.getPopularity();
        }, this));

        _.each(rankedPlayers, function (player) {
            var playerPanel = this.getPlayerPanel(player.index);
            var popularityBarName = (player.getPopularity() >= 0 ? 'PositivePopularityBar' : 'NegativePopularityBar');
            playerPanel.getChildByName(popularityBarName).setPercent(Math.abs(player.getPopularity()) / maxPopularity * 100);
        }, this);
    },
});
