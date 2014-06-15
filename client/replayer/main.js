cc.game.onStart = function () {
    cc.view.setDesignResolutionSize(1024, 768, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);

    var game = new Game(replay.seed);
    game.initialize();
    ReplayerScene.prototype.commands = replay.commands;

    cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new MainScene(game));
    }, this);
};
cc.game.run();