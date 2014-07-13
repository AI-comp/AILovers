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
            return Math.abs(player.getPopularity());
        }, this));

        var minusPopularity = _.min(_.map(rankedPlayers, function (player) {
            return player.getPopularity();
        }, this));
        minusPopularity = minusPopularity >= 0 ? 0 : minusPopularity
        var minusPercent = Math.abs(minusPopularity) / maxPopularity * 100;

        _.each(rankedPlayers, function (player) {
            var playerPanel = this.getPlayerPanel(player.index);
            var popularityBarName = (player.getPopularity() >= 0 ? 'PositivePopularityBar' : 'NegativePopularityBar');
            var popularityBar = playerPanel.getChildByName(popularityBarName);
            popularityBar.loadTexture(res.image.info.revealedBars[player.index]);

            var percent = Math.abs(player.getPopularity()) / maxPopularity * 100;
            popularityBar.setPercent(0);
            // popularityBar.setPercent(percent % ResultScene.INTERVAL_PERCENT);

            popularityBar.setTag(percent);
            // popularityBar.prototype.isWinner = this.game.getWinner() == player.index;

            var repeatCount = percent / ResultScene.INTERVAL_PERCENT;
            var delay = player.getPopularity() <= 0 ? 0 : minusPercent / ResultScene.INTERVAL_PERCENT * ResultScene.INTERVAL * 2
            popularityBar.schedule(this.intervalPercent, ResultScene.INTERVAL, repeatCount, delay);

            if (this.game.getWinner() === player.index) {
                var winImage = playerPanel.getChildByName("WinnerImage");
                winImage.scheduleOnce(this.delayShowWinner, 
                    repeatCount * ResultScene.INTERVAL * 2 + delay);
            }
        }, this);
    },

    intervalPercent: function(delta) {
        // cc.log(delta);
        var newPercent = this.getPercent() + ResultScene.INTERVAL_PERCENT;
        newPercent = (newPercent <= this.getTag()) ? newPercent : this.getTag();
        this.setPercent(newPercent);
    },

    delayShowWinner: function() {
        this.setVisible(true);
        var pulseSequence = new cc.Sequence(new Array(new cc.FadeTo(ResultScene.INTERVAL_PULSE, 100),
            new cc.FadeOut(ResultScene.INTERVAL_PULSE, 255)));
        this.runAction(new cc.RepeatForever(pulseSequence));
    },
});

ResultScene.INTERVAL = 0.01
ResultScene.INTERVAL_PERCENT = 1
ResultScene.INTERVAL_PULSE = 0.6