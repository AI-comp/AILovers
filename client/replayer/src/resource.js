var res = {
    json: {
        mainScene: 'res/MainScene.json',
        dateScene: 'res/DateScene.json',
        resultScene: 'res/ResultScene.json',
        heroinePanel: 'res/publish/HeroinePanel.json',
        datePanel: 'res/publish/DatePanel.json',
        playerPanel: 'res/publish/PlayerPanel.json',
        controlPanel: 'res/publish/ControlPanel.json',
        heartLovePanel: 'res/publish/HeartLovePanel.json',
        barLovePanel: 'res/publish/BarLovePanel.json',
        enthusiasmPanel: 'res/publish/EnthusiasmPanel.json',
        playerResultPanel: 'res/publish/PlayerResultPanel.json',
        cursor: 'res/publish/Cursor.json',
        dateScreen: 'res/publish/DateScreen.json',
    },
    image: {
        info: {
            enthusiasm: 'res/info/enthusiasm.png',
            measure15: 'res/info/measure15.png',
            measure45: 'res/info/measure45.png',
        },
        date: {
        },
    },
};

var g_resources = [
    res.json.mainScene,
    res.json.dateScene,
    res.json.resultScene,
    res.json.heroinePanel,
    res.json.datePanel,
    res.json.playerPanel,
    res.json.controlPanel,
    res.json.heartLovePanel,
    res.json.barLovePanel,
    res.json.enthusiasmPanel,
    res.json.playerResultPanel,
    res.json.cursor,
    res.json.dateScreen,

    res.image.info.enthusiasm,
];

function addNumberedResources(directory, count, extension) {
    var resources = _.map(_.range(count), function (i) {
        return 'res/' + directory + '/' + i + '.' + extension;
    });
    _.each(resources, function (resource) {
        g_resources.push(resource);
    });
    return resources;
}

res.image.info.heroines = addNumberedResources('info/heroine', 8, 'png');
res.image.info.hearts = addNumberedResources('info/heart', 4, 'png');
res.image.info.revealedBars = addNumberedResources('info/bar/revealed', 4, 'png');
res.image.info.realBars = addNumberedResources('info/bar/real', 4, 'png');
res.image.info.playerBackgrounds = addNumberedResources('info/playerBackground', 4, 'png');
res.image.date.heroines = addNumberedResources('date/heroine', 8, 'png');
res.image.date.backgrounds = addNumberedResources('date/background', 8, 'png');
res.image.date.faces = addNumberedResources('date/face', 8, 'png');
