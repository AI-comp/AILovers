cc.game.onStart = function () {
    cc.view.setDesignResolutionSize(1024, 768, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);

    var seed = typeof replay !== 'undefined' ? replay.seed : 0;
    var game = new Game(seed);
    game.initialize();
    ReplayerScene.prototype.game = game;
    ReplayerScene.prototype.commands = replay.commands;

    cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new MainScene());
    }, this);
};
cc.game.run();