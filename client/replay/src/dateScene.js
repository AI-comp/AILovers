var DateScene = cc.Scene.extend({
  ctor: function (game) {
    this._super();
    this.game = game;

    this.sceneNode = ccs.sceneReader.createNodeWithSceneFile(res.DateScene_json);
    this.addChild(this.sceneNode);

    var onFinish = function () {
      cc.director.runScene(new MainScene(game));
    };
    this.scheduleOnce(onFinish, 5);

    return true;
  },
});