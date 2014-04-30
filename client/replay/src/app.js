var MainScene = cc.Scene.extend({
  ctor: function (game) {
    this._super();

    this.game = game;

    this.sceneNode = ccs.sceneReader.createNodeWithSceneFile(res.MainScene_json);
    this.addChild(this.sceneNode);

    this.setGameStatus(game);
  },

  setGameStatus: function (game) {
    for (var heroineIndex = 0; heroineIndex < game.heroines.length; heroineIndex++) {
      var heroine = game.heroines[heroineIndex];
      var heroinePanelNode = this.getChildByTag(heroineIndex);
      var heroinePanel = heroinePanelNode.getChildByTag(0);
      heroinePanel.getChildByName('EnthusiasmLabel').setText(heroine.enthusiasm);
      for (var playerIndex = 0; playerIndex < game.numPlayers; playerIndex++) {
        heroinePanel.getChildByName('LoveLabel' + playerIndex).setText(heroine.revealedLove[playerIndex]);
      }
    }
  },
});