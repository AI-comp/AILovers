var ResultScene = InformationScene.extend({
    popularityBarManagers: new Array(),

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
        var largestPopularity = _.max(_.map(rankedPlayers, function (player) {
            return Math.abs(player.getPopularity());
        }, this));

        _.each(rankedPlayers, function (player) {
            var playerPanel = this.getPlayerPanel(player.index);
            var popularityBarName = (player.getPopularity() >= 0 ? 'PositivePopularityBar' : 'NegativePopularityBar');
            var popularityBar = playerPanel.getChildByName(popularityBarName);
            popularityBar.loadTexture(res.image.info.revealedBars[player.index]);
            popularityBar.setPercent(0);

            var popularityBarManager = new PopularityBarManager(popularityBar, player.getPopularity(), largestPopularity);
            this.popularityBarManagers.push(popularityBarManager);
        }, this);

        this.schedule(this.updatePopularityBars, ResultScene.INTERVAL, cc.REPEAT_FOREVER, 0);
    },

    updatePopularityBars: function () {
        var positiveBarManagers = _.filter(this.popularityBarManagers, function (barManager) {
            return barManager.isPositive() && !barManager.isFinished();
        }, this);
        var negativeBarManagers = _.filter(this.popularityBarManagers, function (barManager) {
            return !barManager.isPositive() && !barManager.isFinished();
        }, this);

        var targetBarManagers;
        if (_.size(negativeBarManagers) > 0) {
            targetBarManagers = negativeBarManagers;
        } else if (_.size(positiveBarManagers) > 0) {
            targetBarManagers = positiveBarManagers;
        } else {
            this.unschedule(this.updatePopularityBars);
            this.showWinner();
            return;
        }

        _.each(targetBarManagers, function (barManager) {
            barManager.increasePercent();
        }, this);
    },

    showWinner: function () {
        var winner = this.game.getWinner();
        if (winner !== '') {
            var winnerPanel = this.getPlayerPanel(winner);
            var winnerImage = winnerPanel.getChildByName('WinnerImage');
            winnerImage.setVisible(true);
            var pulseSequence = new cc.Sequence(new Array(
                new cc.FadeTo(ResultScene.PULSE_INTERVAL, 100),
                new cc.FadeOut(ResultScene.PULSE_INTERVAL, 255)
            ));
            winnerImage.runAction(new cc.RepeatForever(pulseSequence));
        }
    },
});

ResultScene.INTERVAL = 0.03;
ResultScene.PULSE_INTERVAL = 0.6;
