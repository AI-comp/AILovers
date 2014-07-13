var ResultScene = InformationScene.extend({

    barArrays: new Array(new Array(), new Array()),
    showPositive: 0,

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
            var isPositive = player.getPopularity() >= 0;
            var playerPanel = this.getPlayerPanel(player.index);
            var popularityBarName = (isPositive ? 'PositivePopularityBar' : 'NegativePopularityBar');
            var popularityBar = playerPanel.getChildByName(popularityBarName);
            popularityBar.loadTexture(res.image.info.revealedBars[player.index]);

            var percent = Math.abs(player.getPopularity()) / maxPopularity * 100;
            popularityBar.setPercent(0);
            popularityBar.setTag(percent);  // store taget percent at the tag.

            this.barArrays[isPositive ? 1:0].push(popularityBar);

        }, this);

        this.showPositive = 0;
        this.schedule(this.intervalPercentInTurn, ResultScene.INTERVAL, cc.REPEAT_FOREVER, 0);
    },

    intervalPercentInTurn: function(delta) {
        if (this.barArrays[this.showPositive].length <= 0) {
            if (this.showPositive == 1) {
                this.unschedule(this.intervalPercentInTurn);
                this.showWinner();
            } else {
                this.showPositive = 1;
            }
        }

        for (var i = 0; i < this.barArrays[this.showPositive].length; i++) {
            var bar = this.barArrays[this.showPositive][i];
            var newPercent = bar.getPercent() + ResultScene.INTERVAL_PERCENT;
            newPercent = (newPercent <= bar.getTag()) ? newPercent : bar.getTag();
            bar.setPercent(newPercent);

            if (newPercent == bar.getTag()) {
                this.barArrays[this.showPositive].splice(i--, 1);
            }
        };
    },

    showWinner: function() {
        var winner = this.game.getWinner();
        if (winner !== "" && winner >= 0 && winner < 4) {
            var winnerPanel = this.getPlayerPanel(winner);

            var winImage = winnerPanel.getChildByName("WinnerImage");
            winImage.setVisible(true);
            var pulseSequence = new cc.Sequence(new Array(new cc.FadeTo(ResultScene.INTERVAL_PULSE, 100),
                new cc.FadeOut(ResultScene.INTERVAL_PULSE, 255)));
            winImage.runAction(new cc.RepeatForever(pulseSequence));
        }
    },
});

ResultScene.INTERVAL = 0.03;
ResultScene.INTERVAL_PERCENT = 3;
ResultScene.INTERVAL_PULSE = 0.6;
