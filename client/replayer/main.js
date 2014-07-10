var runGame = function () {
    var game = new Game(replay.seed);
    game.initialize();
    ReplayerScene.prototype.commands = replay.commands;

    ReplayerScene.prototype.heroineIds = [];
    var mt = new MersenneTwister(replay.seed);
    var numHeroines = game.getNumHeroines();
    var remainingHeroineIds = _.range(_.size(res.image.info.heroines));
    _(numHeroines).times(function (i) {
        var heroineId = remainingHeroineIds[Math.floor(mt.random() * _.size(remainingHeroineIds))];
        remainingHeroineIds = _.without(remainingHeroineIds, heroineId);
        ReplayerScene.prototype.heroineIds.push(heroineId);
    }, this);

    ReplayerScene.prototype.backgroundIds = _.map(_.range(game.getNumTurns()), function (i) {
        return _.map(_.range(game.getNumPlayers()), function (j) {
            return _.map(_.range(game.getNumRequiredCommands()), function (k) {
                return Math.floor(mt.random() * _.size(res.image.date.backgrounds));
            }, this);
        }, this);
    }, this);

    var transition = cc.TransitionFade.create(0.5, new MainScene(game));
    cc.director.runScene(transition);
};

cc.game.onStart = function () {
    cc.view.setDesignResolutionSize(1024, 768, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);

    cc.LoaderScene.preload(g_resources, function () {
        runGame();
    }, this);
};

cc.game.run();

if (!cc._supportRender) {
    $('#gameArea').html('Please enable WebGL in your browser. For more infomation, visit <a href="http://get.webgl.org/" target="_blank">http://get.webgl.org/</a>.');
}