var DateScene = ReplayerScene.extend({
    ctor: function () {
        this._super();

        this.sceneNode = ccs.sceneReader.createNodeWithSceneFile(res.json.dateScene);
        this.addChild(this.sceneNode);

        this.showFaceImages();

        this.createCursors();

        return true;
    },

    onEnterTransitionDidFinish: function () {
        this.schedule(this.showNextDateImage, 0.5, cc.REPEAT_FOREVER);
    },

    transitToMainScene: function () {
        this.game.processTurn(this.getCurrentCommands());
        var transition = cc.TransitionFadeTR.create(0.5, new MainScene());
        cc.director.runScene(transition);
    },

    showFaceImages: function () {
        _(this.game.getNumPlayers()).times(function (playerIndex) {
            var datePanel = this.getDatePanel(playerIndex);

            datePanel.getChildByName('WeekdayTargetPanel').setVisible(this.game.isWeekday());
            datePanel.getChildByName('HolidayTargetPanel').setVisible(!this.game.isWeekday());
            var targetPanel = this.getTargetPanel(datePanel);

            _(this.game.getNumRequiredCommands()).times(function (commandIndex) {
                var targetHeroine = this.getCommand(playerIndex, commandIndex);
                targetPanel.getChildByName('Heroine' + commandIndex).loadTexture(res.image.faces[targetHeroine]);
            }, this);
        }, this);
    },

    getDatePanel: function (playerIndex) {
        var datePanelNode = this.sceneNode.getChildByTag(playerIndex);
        return datePanelNode.getChildByTag(0);
    },

    getTargetPanel: function (datePanel) {
        if (this.game.isWeekday()) {
            return datePanel.getChildByName('WeekdayTargetPanel');;
        } else {
            return datePanel.getChildByName('HolidayTargetPanel');
        }
    },

    createCursors: function () {
        this.cursors = [];
        _(this.game.getNumPlayers()).times(function (playerIndex) {
            var cursor = ccs.uiReader.widgetFromJsonFile(res.json.cursor);
            cursor.setAnchorPoint(0.5, 0.5);
            cursor.setVisible(false);
            var targetPanel = this.getTargetPanel(this.getDatePanel(playerIndex));
            targetPanel.addChild(cursor);
            this.cursors.push(cursor);
        }, this);

        this.cursorPosition = -1;
    },

    showNextDateImage: function () {
        this.cursorPosition++;
        if (this.cursorPosition == this.game.getNumRequiredCommands()) {
            this.unscheduleAllCallbacks();
            this.transitToMainScene();
        } else {
            _(this.game.getNumPlayers()).times(function (playerIndex) {
                var datePanel = this.getDatePanel(playerIndex);

                var screen = datePanel.getChildByName('Screen');
                var targetHeroine = this.getCommand(playerIndex, this.cursorPosition);
                screen.loadTexture(res.image.dates[targetHeroine]);

                var targetPanel = this.getTargetPanel(datePanel);
                var targetHeroineImage = targetPanel.getChildByName('Heroine' + this.cursorPosition);
                this.cursors[playerIndex].setVisible(true);
                var moveTo = cc.MoveTo.create(0.15, targetHeroineImage.getPosition());
                this.cursors[playerIndex].runAction(cc.EaseOut.create(moveTo, 2));
            }, this);
        }
    },
});