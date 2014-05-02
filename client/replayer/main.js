cc.game.onStart = function () {
    cc.view.setDesignResolutionSize(1024, 768, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);

    var seed = typeof replay !== 'undefined' ? replay.seed : 0;
    var game = new Game(seed);
    game.initialize(4);
    var defaultCommands = _.map(_.range(10), function (i) {
        return _.map(_.range(4), function (j) {
            return _.range(5);
        });
    });
    var commands = typeof replay !== 'undefined' ? replay.commands : defaultCommands;
    ReplayerScene.prototype.game = game;
    ReplayerScene.prototype.commands = commands;

    cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new MainScene());
    }, this);
};
cc.game.run();