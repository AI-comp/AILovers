cc.game.onStart = function () {
    cc.view.setDesignResolutionSize(1024, 768, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);

    cc.LoaderScene.preload(g_resources, function () {
        var seed = replay ? replay.seed : 0;
        var commands = replay ? replay.commands : [];
        var game = new Game(seed);
        var commands = commands;
        game.initialize(4);
        cc.director.runScene(new MainScene(game, commands));
    }, this);
};
cc.game.run();