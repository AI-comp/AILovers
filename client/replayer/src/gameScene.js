var GameScene = ReplayerScene.extend({
    ctor: function (game) {
        this._super();
        this.game = game;
        return true;
    },

    setupPanels: function () {
        this.setupHeroinePanels();
        this.setupPlayerPanels();
        this.setupControlPanel();
    },

    getHeroinePanel: function (heroineIndex) {
        return this.getPanel(heroineIndex);
    },

    getPlayerPanel: function (playerIndex) {
        return this.getPanel(10 + playerIndex);
    },

    getPanel: function (tag) {
        var panelNode = this.sceneNode.getChildByTag(tag);
        return panelNode.getChildByTag(0);
    },

    setupPlayerPanels: function () {
        // TODO: set icons and names
    },

    setupHeroinePanels: function () {
        _(this.game.getNumHeroines()).times(function (heroineIndex) {
            var heroine = this.game.heroines[heroineIndex];
            var heroinePanel = this.getHeroinePanel(heroineIndex);
            heroinePanel.setBackGroundImage(res.image.heroines[heroineIndex], ccui.Widget.LOCAL_TEXTURE);

            var enthusiasmPanel = ccs.uiReader.widgetFromJsonFile(res.json.enthusiasmPanel);
            heroinePanel.getChildByName('EnthusiasmArea').addChild(enthusiasmPanel);
            _(heroine.enthusiasm).times(function (enthusiasmIndex) {
                var enthusiasmImage = enthusiasmPanel.getChildByName('Enthusiasm' + (enthusiasmIndex + 1));
                enthusiasmImage.loadTexture(res.image.enthusiasm);
            }, this);
        }, this);

        this.setupLovePanels();
    },

    setupLovePanels: function () {
        _(this.game.getNumHeroines()).times(function (heroineIndex) {
            var heroine = this.game.heroines[heroineIndex];
            var heroinePanel = this.getHeroinePanel(heroineIndex);

            _(this.game.getNumPlayers()).times(function (playerIndex) {
                var loveArea = heroinePanel.getChildByName('LoveArea' + playerIndex);
                loveArea.removeAllChildren(true);

                switch (this.getLovePanelMode()) {
                    case GameScene.HEART_LOVE_PANEL_MODE:
                    default:
                        var lovePanel = new HeartLovePanel(playerIndex);
                        break;
                    case GameScene.BAR_LOVE_PANEL_MODE:
                        var lovePanel = new BarLovePanel(playerIndex, this.game.getMaxLove());
                        break;
                }
                loveArea.addChild(lovePanel);
                lovePanel.setLove(heroine.revealedLove[playerIndex], heroine.realLove[playerIndex]);
            }, this);
        }, this);
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
            heartButton.setBright(false);
            heartButton.setTouchEnabled(false);
            barButton.setBright(false);
            barButton.setTouchEnabled(false);
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

    setLovePanelMode: function (mode) {
        GameScene.prototype.lovePanelMode = mode;
        this.setupLovePanels();
    },

    getLovePanelMode: function () {
        return this.lovePanelMode;
    },
});

GameScene.HEART_LOVE_PANEL_MODE = 0;
GameScene.BAR_LOVE_PANEL_MODE = 1;
GameScene.prototype.lovePanelMode = GameScene.HEART_LOVE_PANEL_MODE;