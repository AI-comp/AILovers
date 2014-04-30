var MainScene = cc.Scene.extend({
  ctor: function (game) {
    this._super();
    this.game = game;

    this.sceneNode = ccs.sceneReader.createNodeWithSceneFile(res.MainScene_json);
    this.addChild(this.sceneNode);

    this.setGameStatus();

    var controlPanelNode = this.sceneNode.getChildByTag(100);
    var controlPanel = controlPanelNode.getChildByTag(0);
    controlPanel.getChildByName('NextButton').onPressStateChangedToPressed = function () {
      cc.director.runScene(new DateScene(game));
    }

    return true;
  },

  setGameStatus: function () {
    for (var heroineIndex = 0; heroineIndex < this.game.heroines.length; heroineIndex++) {
      var heroine = this.game.heroines[heroineIndex];
      var heroinePanelNode = this.sceneNode.getChildByTag(heroineIndex);
      var heroinePanel = heroinePanelNode.getChildByTag(0);
      heroinePanel.getChildByName('EnthusiasmLabel').setText(heroine.enthusiasm);
      for (var playerIndex = 0; playerIndex < this.game.numPlayers; playerIndex++) {
        heroinePanel.getChildByName('LoveLabel' + playerIndex).setText(heroine.revealedLove[playerIndex]);
      }
    }
  },

  onExit: function () {
    this._super();
    console.log('exit');
  },
});
