var GameScene = ReplayerScene.extend({
    ctor: function (game) {
        this._super();
        
        return true;
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

    setupPlayerPanels: function (scalable) {
        _(this.game.getNumPlayers()).times(function (playerIndex) {
            var playerPanel = this.getPlayerPanel(playerIndex);
            scalable = typeof scalable !== 'undefined' ? scalable : false
            playerPanel.setBackGroundImageScale9Enabled(scalable);
            playerPanel.setBackGroundImage(res.image.playerBackgrounds[playerIndex], ccui.Widget.LOCAL_TEXTURE);
        }, this);
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

                switch (this.lovePanelMode) {
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

});

GameScene.HEART_LOVE_PANEL_MODE = 0;
GameScene.BAR_LOVE_PANEL_MODE = 1;
GameScene.prototype.lovePanelMode = GameScene.HEART_LOVE_PANEL_MODE;