var DateScene = cc.Scene.extend({
  ctor: function (game, commands) {
    this._super();

    this.sceneNode = ccs.sceneReader.createNodeWithSceneFile(res.DateScene_json);
    this.addChild(this.sceneNode);

    var onFinish = function () {
      game.processTurn(commands[game.turn]);
      cc.director.runScene(new MainScene(game, commands));
    };
    this.scheduleOnce(onFinish, 5);

    return true;
  },
});