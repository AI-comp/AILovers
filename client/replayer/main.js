cc.game.onStart = function () {
    cc.view.setDesignResolutionSize(1024, 768, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);

    cc.LoaderScene.preload(g_resources, function () {
        var seed = typeof replay !== 'undefined' ? replay.seed : 0;
        var defaultCommands = _.map(_.range(10), function (i) {
            return _.map(_.range(4), function (j) {
                return _.range(5);
            });
        });
        var commands = typeof replay !== 'undefined' ? replay.commands : defaultCommands;
        var game = new Game(seed);
        var commands = commands;
        game.initialize(4);
        cc.director.runScene(new MainScene(game, commands));
    }, this);
};
cc.game.run();