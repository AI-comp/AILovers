var DateScene = ReplayerScene.extend({
    ctor: function () {
        this._super();

        this.sceneNode = ccs.sceneReader.createNodeWithSceneFile(res.json.dateScene);
        this.addChild(this.sceneNode);

        this.setupDatePanels();

        return true;
    },

    onEnterTransitionDidFinish: function () {
        this._super();

        this.schedule(this.switchToNextDate, 0.5, cc.REPEAT_FOREVER);
    },

    onExitTransitionDidStart: function () {
        this._super();

        _(this.game.getNumPlayers()).times(function (playerIndex) {
            var datePanel = this.getDatePanel(playerIndex);
            datePanel.getChildByName('Screen').setClippingEnabled(false);
        }, this);
    },

    transitToMainScene: function () {
        this.game.processTurn(this.getCurrentCommands());
        var transition = cc.TransitionFadeTR.create(0.5, new MainScene());
        cc.director.runScene(transition);
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

    setupDatePanels: function () {
        this.cursors = [];
        this.cursorPosition = -1;
        _(this.game.getNumPlayers()).times(function (playerIndex) {
            var datePanel = this.getDatePanel(playerIndex);
            this.showFaceImage(datePanel, playerIndex);
            this.cursors.push(this.createCursor(datePanel));
            datePanel.getChildByName('Screen').setClippingEnabled(true);
        }, this);
    },

    showFaceImage: function (datePanel, playerIndex) {
        datePanel.getChildByName('WeekdayTargetPanel').setVisible(this.game.isWeekday());
        datePanel.getChildByName('HolidayTargetPanel').setVisible(!this.game.isWeekday());
        var targetPanel = this.getTargetPanel(datePanel);

        _(this.game.getNumRequiredCommands()).times(function (commandIndex) {
            var targetHeroine = this.getCommand(playerIndex, commandIndex);
            targetPanel.getChildByName('Heroine' + commandIndex).loadTexture(res.image.faces[targetHeroine]);
        }, this);
    },

    createCursor: function (datePanel) {
        var cursor = ccs.uiReader.widgetFromJsonFile(res.json.cursor);
        cursor.setAnchorPoint(0.5, 0.5);
        cursor.setVisible(false);
        var targetPanel = this.getTargetPanel(datePanel);
        targetPanel.addChild(cursor);
        return cursor;
    },

    switchToNextDate: function () {
        this.cursorPosition++;
        if (this.cursorPosition == this.game.getNumRequiredCommands()) {
            this.unscheduleAllCallbacks();
            this.transitToMainScene();
        } else {
            _(this.game.getNumPlayers()).times(function (playerIndex) {
                var datePanel = this.getDatePanel(playerIndex);
                this.showNextScreenImage(datePanel, playerIndex);
                this.moveCursorToNextTarget(datePanel, playerIndex);
            }, this);
        }
    },

    showNextScreenImage: function (datePanel, playerIndex) {
        var screen = datePanel.getChildByName('Screen');
        var targetHeroine = this.getCommand(playerIndex, this.cursorPosition);

        var nextScreenImage = ccui.ImageView.create();
        nextScreenImage.loadTexture(res.image.dates[targetHeroine]);
        nextScreenImage.setAnchorPoint(new cc.Point(0, 0));
        nextScreenImage.setPosition(new cc.Point(screen.width, 0));
        screen.addChild(nextScreenImage);
        var moveTo = cc.MoveTo.create(0.15, new cc.Point(0, 0));
        nextScreenImage.runAction(cc.EaseOut.create(moveTo, 2));
    },

    moveCursorToNextTarget: function (datePanel, playerIndex) {
        var targetPanel = this.getTargetPanel(datePanel);
        var targetHeroineImage = targetPanel.getChildByName('Heroine' + this.cursorPosition);

        this.cursors[playerIndex].setVisible(true);
        var moveTo = cc.MoveTo.create(0.15, targetHeroineImage.getPosition());
        this.cursors[playerIndex].runAction(cc.EaseOut.create(moveTo, 2));
    },
});