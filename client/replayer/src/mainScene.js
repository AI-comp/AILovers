var MainScene = GameScene.extend({
    ctor: function (game) {
        this._super();
        this.game = game;

        this.sceneNode = ccs.sceneReader.createNodeWithSceneFile(res.json.mainScene);
        this.addChild(this.sceneNode);

        this.setupHeroinePanels();
        this.setupPlayerPanels();
        this.setupControlPanel();

        if (this.game.isFinished()) {
            this.showResults();
        }

        return true;
    },

    setLovePanelMode: function (mode) {
        GameScene.prototype.lovePanelMode = mode;
        this.setupLovePanels();
    },

    setupControlPanel: function () {
        var controlPanelNode = this.sceneNode.getChildByTag(100);
        var controlPanel = controlPanelNode.getChildByTag(0);

        var proceedButton = controlPanel.getChildByName('ProceedButton');
        var previousButton = controlPanel.getChildByName('PreviousButton');
        var nextButton = controlPanel.getChildByName('NextButton');
        var firstButton = controlPanel.getChildByName('FirstButton');
        var lastButton = controlPanel.getChildByName('LastButton');
        var heartButton = controlPanel.getChildByName('HeartButton');
        var barButton = controlPanel.getChildByName('BarButton');

        this.addTouchEventListenerToButton(proceedButton, this.transitToDateScene);
        this.addTouchEventListenerToButton(previousButton, _.partial(this.transitToSpecificTurn, this.game.turn - 1));
        this.addTouchEventListenerToButton(nextButton, _.partial(this.transitToSpecificTurn, this.game.turn + 1));
        this.addTouchEventListenerToButton(firstButton, _.partial(this.transitToSpecificTurn, this.game.initialTurn));
        this.addTouchEventListenerToButton(lastButton, _.partial(this.transitToSpecificTurn, this.game.lastTurn + 1));
        this.addTouchEventListenerToButton(heartButton, _.partial(this.setLovePanelMode, GameScene.HEART_LOVE_PANEL_MODE));
        this.addTouchEventListenerToButton(barButton, _.partial(this.setLovePanelMode, GameScene.BAR_LOVE_PANEL_MODE));

        if (this.game.turn <= this.game.initialTurn) {
            previousButton.setBright(false);
            previousButton.setTouchEnabled(false);
            firstButton.setBright(false);
            firstButton.setTouchEnabled(false);
        }
        if (this.game.turn > this.game.lastTurn) {
            proceedButton.setBright(false);
            proceedButton.setTouchEnabled(false);
            nextButton.setBright(false);
            nextButton.setTouchEnabled(false);
            lastButton.setBright(false);
            lastButton.setTouchEnabled(false);
        }
    },

    addTouchEventListenerToButton: function (button, callback) {
        button.addTouchEventListener(function (object, eventType) {
            if (eventType == ccui.Widget.TOUCH_ENDED) {
                callback.call(this);
            }
        }, this);
    },

    transitToDateScene: function () {
        if (!this.game.isFinished()) {
            var transition = cc.TransitionFadeBL.create(0.5, new DateScene(this.game));
            cc.director.runScene(transition);
        }
    },

    transitToSpecificTurn: function (turn) {
        if (turn < this.game.initialTurn || turn > this.game.lastTurn + 1) {
            return;
        }

        var game = new Game(this.game.replay.seed);
        game.initialize();
        while (game.turn < turn) {
            game.processTurn(this.getCurrentCommands(game));
        }

        if (turn > this.game.lastTurn) {
            var transition = cc.TransitionFade.create(0.5, new ResultScene(game));
        } else {
            var transition = cc.TransitionFade.create(0.5, new MainScene(game));
        }
        cc.director.runScene(transition);
    },

});
