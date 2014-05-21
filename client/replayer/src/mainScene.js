var MainScene = ReplayerScene.extend({
    ctor: function () {
        this._super();

        this.sceneNode = ccs.sceneReader.createNodeWithSceneFile(res.json.mainScene);
        this.addChild(this.sceneNode);

        this.setupHeroinePanels();
        this.setGameStatus();

        if (this.game.isFinished()) {
            this.showResults();
        } else {
            this.setupControlPanel();
        }

        return true;
    },

    setupHeroinePanels: function () {
        _(this.game.getNumHeroines()).times(function (heroineIndex) {
            var heroinePanel = this.getHeroinePanel(heroineIndex);
            heroinePanel.setBackGroundImage(res.image.heroines[heroineIndex], ccui.Widget.LOCAL_TEXTURE);

            _(this.game.getNumPlayers()).times(function (playerIndex) {
                var lovePanel = new HeartLovePanel(res.image.hearts[playerIndex]);
                //var lovePanel = new BarLovePanel();
                heroinePanel.getChildByName('LoveArea' + playerIndex).addChild(lovePanel);
            }, this);
        }, this);
    },

    setGameStatus: function () {
        _(this.game.getNumHeroines()).times(function (heroineIndex) {
            var heroine = this.game.heroines[heroineIndex];
            var heroinePanel = this.getHeroinePanel(heroineIndex);
            heroinePanel.getChildByName('EnthusiasmLabel').setText(heroine.enthusiasm);
            _(this.game.getNumPlayers()).times(function (playerIndex) {
                var lovePanel = heroinePanel.getChildByName('LoveArea' + playerIndex).getChildByName('LovePanel');
                lovePanel.setLove(heroine.revealedLove[playerIndex], heroine.realLove[playerIndex]);
            }, this);
        }, this);
    },

    getHeroinePanel: function (heroineIndex) {
        var heroinePanelNode = this.sceneNode.getChildByTag(heroineIndex);
        return heroinePanelNode.getChildByTag(0);
    },

    setupControlPanel: function () {
        var controlPanelNode = this.sceneNode.getChildByTag(100);
        var controlPanel = controlPanelNode.getChildByTag(0);
        controlPanel.getChildByName('NextButton').onPressStateChangedToPressed = this.getTransitionToDateScene();
    },

    getTransitionToDateScene: function () {
        var self = this;
        return function () {
            if (!self.game.isFinished()) {
                var transition = cc.TransitionFadeBL.create(0.5, new DateScene());
                cc.director.runScene(transition);
            }
        }
    },

    showResults: function () {
        var resultLabel = cc.LabelTTF.create('', 'Arial', 18);
        var lines = [];
        lines.push('Winner: ' + this.game.getWinner());
        _.each(this.game.getRanking(), function (player) {
            lines.push('Player ' + player.index + ': ' + player.popularity + ' popularity');
        });
        resultLabel.setString(lines.join('\n'));
        resultLabel.setFontFillColor(new cc.Color(0, 0, 0));
        this.sceneNode.addChild(resultLabel, 5);
        var size = cc.director.getWinSize();
        resultLabel.setPosition(size.width / 2, size.height / 2);
    },
});
