var MainScene = cc.Scene.extend({
  ctor: function (game, commands) {
    this._super();

    this.sceneNode = ccs.sceneReader.createNodeWithSceneFile(res.MainScene_json);
    this.addChild(this.sceneNode);

    this.setGameStatus(game);

    var controlPanelNode = this.sceneNode.getChildByTag(100);
    var controlPanel = controlPanelNode.getChildByTag(0);
    controlPanel.getChildByName('NextButton').onPressStateChangedToPressed = function () {
      if (!game.isFinished()) {
        cc.director.runScene(new DateScene(game, commands));
      }
    }

    return true;
  },

  setGameStatus: function (game) {
    for (var heroineIndex = 0; heroineIndex < game.heroines.length; heroineIndex++) {
      var heroine = game.heroines[heroineIndex];
      var heroinePanelNode = this.sceneNode.getChildByTag(heroineIndex);
      var heroinePanel = heroinePanelNode.getChildByTag(0);
      heroinePanel.getChildByName('EnthusiasmLabel').setText(heroine.enthusiasm);
      for (var playerIndex = 0; playerIndex < game.numPlayers; playerIndex++) {
        heroinePanel.getChildByName('LoveLabel' + playerIndex).setText(heroine.revealedLove[playerIndex]);
      }
    }
  },
});
