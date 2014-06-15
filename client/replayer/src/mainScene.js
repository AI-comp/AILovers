var MainScene = ReplayerScene.extend({
    ctor: function (game) {
        this._super();
        this.game = game;

        this.sceneNode = ccs.sceneReader.createNodeWithSceneFile(res.json.mainScene);
        this.addChild(this.sceneNode);

        this.setupHeroinePanels();
        this.setupPlayerPanels();
        this.setGameStatus();
        this.setupControlPanel();

        if (this.game.isFinished()) {
            this.showResults();
        }

        return true;
    },

    setupHeroinePanels: function () {
        _(this.game.getNumHeroines()).times(function (heroineIndex) {
            var heroinePanel = this.getHeroinePanel(heroineIndex);
            heroinePanel.setBackGroundImage(res.image.heroines[heroineIndex], ccui.Widget.LOCAL_TEXTURE);

            var enthusiasmPanel = ccs.uiReader.widgetFromJsonFile(res.json.enthusiasmPanel);
            heroinePanel.getChildByName('EnthusiasmArea').addChild(enthusiasmPanel);

            _(this.game.getNumPlayers()).times(function (playerIndex) {
                var lovePanel = new HeartLovePanel(res.image.hearts[playerIndex]);
                //var lovePanel = new BarLovePanel();
                heroinePanel.getChildByName('LoveArea' + playerIndex).addChild(lovePanel);
            }, this);
        }, this);
    },

    setupPlayerPanels: function () {
        _(this.game.getNumPlayers()).times(function (playerIndex) {
            var playerPanel = this.getPlayerPanel(playerIndex);
            playerPanel.setBackGroundImage(res.image.playerBackgrounds[playerIndex], ccui.Widget.LOCAL_TEXTURE);
        }, this);
    },

    setGameStatus: function () {
        _(this.game.getNumHeroines()).times(function (heroineIndex) {
            var heroine = this.game.heroines[heroineIndex];
            var heroinePanel = this.getHeroinePanel(heroineIndex);

            var enthusiasmPanel = heroinePanel.getChildByName('EnthusiasmArea').getChildByName('EnthusiasmPanel');
            _(heroine.enthusiasm).times(function (enthusiasmIndex) {
                var enthusiasmImage = enthusiasmPanel.getChildByName('Enthusiasm' + (enthusiasmIndex + 1));
                enthusiasmImage.loadTexture(res.image.enthusiasm);
            }, this);

            _(this.game.getNumPlayers()).times(function (playerIndex) {
                var lovePanel = heroinePanel.getChildByName('LoveArea' + playerIndex).getChildByName('LovePanel');
                lovePanel.setLove(heroine.revealedLove[playerIndex], heroine.realLove[playerIndex]);
            }, this);
        }, this);
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

    setupControlPanel: function () {
        var controlPanelNode = this.sceneNode.getChildByTag(100);
        var controlPanel = controlPanelNode.getChildByTag(0);

        var proceedButton = controlPanel.getChildByName('ProceedButton');
        var previousButton = controlPanel.getChildByName('PreviousButton');
        var nextButton = controlPanel.getChildByName('NextButton');
        var firstButton = controlPanel.getChildByName('FirstButton');
        var lastButton = controlPanel.getChildByName('LastButton');

        this.addTouchEventListenerToButton(proceedButton, this.transitToDateScene);
        this.addTouchEventListenerToButton(previousButton, _.partial(this.transitToSpecificTurn, this.game.turn - 1));
        this.addTouchEventListenerToButton(nextButton, _.partial(this.transitToSpecificTurn, this.game.turn + 1));
        this.addTouchEventListenerToButton(firstButton, _.partial(this.transitToSpecificTurn, this.game.initialTurn));
        this.addTouchEventListenerToButton(lastButton, _.partial(this.transitToSpecificTurn, this.game.lastTurn + 1));

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

        var game = new Game(this.game.seed);
        game.initialize();
        while (game.turn < turn) {
            game.processTurn(this.getCurrentCommands(game));
        }

        var transition = cc.TransitionFade.create(0.5, new MainScene(game));
        cc.director.runScene(transition);
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
    },
});
