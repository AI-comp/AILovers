var MainScene = ReplayerScene.extend({
    ctor: function () {
        this._super();

        this.sceneNode = ccs.sceneReader.createNodeWithSceneFile(res.json.mainScene);
        this.addChild(this.sceneNode);

        this.loadHeroineImages();
        this.setGameStatus();

        var controlPanelNode = this.sceneNode.getChildByTag(100);
        var controlPanel = controlPanelNode.getChildByTag(0);
        controlPanel.getChildByName('NextButton').onPressStateChangedToPressed = this.getTransitionToDateScene();

        return true;
    },

    loadHeroineImages: function () {
        _(this.game.getNumHeroines()).times(function (heroineIndex) {
            var heroinePanel = this.getHeroinePanel(heroineIndex);
            heroinePanel.getChildByName('FaceImage').loadTexture(res.image.faces[heroineIndex]);
        }, this);
    },

    setGameStatus: function () {
        _(this.game.getNumHeroines()).times(function (heroineIndex) {
            var heroine = this.game.heroines[heroineIndex];
            var heroinePanel = this.getHeroinePanel(heroineIndex);
            heroinePanel.getChildByName('EnthusiasmLabel').setText(heroine.enthusiasm);
            for (var playerIndex = 0; playerIndex < this.game.getNumPlayers() ; playerIndex++) {
                heroinePanel.getChildByName('LoveLabel' + playerIndex).setText(heroine.revealedLove[playerIndex]);
            }
        }, this);
    },

    getHeroinePanel: function (heroineIndex) {
        var heroinePanelNode = this.sceneNode.getChildByTag(heroineIndex);
        return heroinePanelNode.getChildByTag(0);
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
});
