var DateScene = cc.Scene.extend({
    ctor: function (game, commands) {
        this._super();
        this.game = game;
        this.commands = commands;

        this.sceneNode = ccs.sceneReader.createNodeWithSceneFile(res.DateScene_json);
        this.addChild(this.sceneNode);

        this.showFaceImages();
        this.scheduleOnce(this.onFinish, 5);

        return true;
    },

    showFaceImages: function () {
        _(this.game.getNumPlayers()).times(function (playerIndex) {
            var datePanel = this.getDatePanel(playerIndex);

            var weekdayTargetPanel = datePanel.getChildByName('WeekdayTargetPanel');
            var holidayTargetPanel = datePanel.getChildByName('HolidayTargetPanel');
            weekdayTargetPanel.setVisible(this.game.isWeekday());
            holidayTargetPanel.setVisible(!this.game.isWeekday());
            var targetPanel = this.game.isWeekday() ? weekdayTargetPanel : holidayTargetPanel;

            _(this.game.getNumRequiredCommands()).times(function (commandIndex) {
                var targetHeroine = this.commands[this.game.turn][playerIndex][commandIndex];
                targetPanel.getChildByName('Heroine' + targetHeroine).loadTexture(res.faceImages[targetHeroine]);
            }, this);
        }, this);
    },

    onFinish: function () {
        this.game.processTurn(this.commands[this.game.turn]);
        cc.director.runScene(new MainScene(this.game, this.commands));
    },

    getDatePanel: function (playerIndex) {
        var datePanelNode = this.sceneNode.getChildByTag(playerIndex);
        return datePanelNode.getChildByTag(0);
    },
});