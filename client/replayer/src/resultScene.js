var ResultScene = InformationScene.extend({
    ctor: function (game) {
        this._super(game);
        return true;
    },

    createSceneNode: function () {
        return ccs.sceneReader.createNodeWithSceneFile(res.json.resultScene);
    },

    getLovePanelMode: function () {
        return InformationScene.BAR_LOVE_PANEL_MODE;
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
            var popularityBar = playerPanel.getChildByName(popularityBarName);
            popularityBar.loadTexture(res.image.info.revealedBars[player.index]);
            popularityBar.setPercent(Math.abs(player.getPopularity()) / maxPopularity * 100);

            if (this.game.getWinner() == player.index) {
                var winImage = playerPanel.getChildByName("WinnerImage");
                winImage.setVisible(true);
                var pulseSequence = new cc.Sequence(new Array(new cc.FadeTo(0.6, 100), new cc.FadeOut(0.6, 255)));
                winImage.runAction(new cc.RepeatForever(pulseSequence));
            }
        }, this);
    },
});
