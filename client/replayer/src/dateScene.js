var DateScene = cc.Scene.extend({
    ctor: function (game, commands) {
        this._super();
        this.game = game;
        this.commands = commands;

        this.sceneNode = ccs.sceneReader.createNodeWithSceneFile(res.json.dateScene);
        this.addChild(this.sceneNode);

        this.showFaceImages();

        this.createCursors();
        this.schedule(this.showNextDateImage, 0.5, cc.REPEAT_FOREVER);

        return true;
    },

    transitionToMainScene: function () {
        this.game.processTurn(this.commands[this.game.turn]);
        cc.director.runScene(new MainScene(this.game, this.commands));
    },

    showFaceImages: function () {
        _(this.game.getNumPlayers()).times(function (playerIndex) {
            var datePanel = this.getDatePanel(playerIndex);

            datePanel.getChildByName('WeekdayTargetPanel').setVisible(this.game.isWeekday());
            datePanel.getChildByName('HolidayTargetPanel').setVisible(!this.game.isWeekday());
            var targetPanel = this.getTargetPanel(datePanel);

            _(this.game.getNumRequiredCommands()).times(function (commandIndex) {
                var targetHeroine = this.commands[this.game.turn][playerIndex][commandIndex];
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
            this.transitionToMainScene();
        } else {
            _(this.game.getNumPlayers()).times(function (playerIndex) {
                var datePanel = this.getDatePanel(playerIndex);

                var screen = datePanel.getChildByName('Screen');
                var targetHeroine = this.commands[this.game.turn][playerIndex][this.cursorPosition];
                screen.loadTexture(res.image.dates[targetHeroine]);

                var targetPanel = this.getTargetPanel(datePanel);
                var targetHeroineImage = targetPanel.getChildByName('Heroine' + this.cursorPosition);
                this.cursors[playerIndex].setPosition(targetHeroineImage.getPosition());
                this.cursors[playerIndex].setVisible(true);
            }, this);
        }
    },
});