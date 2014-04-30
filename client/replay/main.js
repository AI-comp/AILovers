cc.game.onStart = function () {
  cc.view.setDesignResolutionSize(1024, 768, cc.ResolutionPolicy.SHOW_ALL);
  cc.view.resizeWithBrowserSize(true);

  cc.LoaderScene.preload(g_resources, function () {
    cc.director.runScene(new MainScene(new Game()));
  }, this);
};
cc.game.run();