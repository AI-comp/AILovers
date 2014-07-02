var ResultScene = GameScene.extend({
    ctor: function (game) {
        this._super(game);

        this.sceneNode = ccs.sceneReader.createNodeWithSceneFile(res.json.resultScene);
        this.addChild(this.sceneNode);
        this.setupPanels();

        //this.showResults();

        return true;
    },

    showResults: function () {
        var resultLabel = cc.LabelTTF.create('', 'Arial', 18);
        var lines = [];
        lines.push('Winner: ' + this.game.getWinner());
        _.each(this.game.getRanking(), function (player) {
            lines.push('Player ' + player.index + ': ' + player.getPopularity() + ' popularity');
        });
        resultLabel.setString(lines.join('\n'));
        resultLabel.setFontFillColor(new cc.Color(0, 0, 0));
        this.sceneNode.addChild(resultLabel, 5);
        var size = cc.director.getWinSize();
        resultLabel.setPosition(size.width / 2, size.height / 2);
        var transition = cc.TransitionFade.create(0.5, new ResultScene(this.game));
        cc.director.runScene(transition);
    },

    getLovePanelMode: function () {
        return GameScene.BAR_LOVE_PANEL_MODE;
    },
});
