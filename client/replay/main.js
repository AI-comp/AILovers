cc.game.onStart = function () {
  cc.view.setDesignResolutionSize(1024, 768, cc.ResolutionPolicy.SHOW_ALL);
  cc.view.resizeWithBrowserSize(true);

  cc.LoaderScene.preload(g_resources, function () {
    var game = new Game();
    game.initialize(4);
    cc.director.runScene(new MainScene(game));
  }, this);
};
cc.game.run();