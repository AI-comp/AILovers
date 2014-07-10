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
        playerResultPanel: 'res/publish/PlayerResultPanel.json',
        cursor: 'res/publish/Cursor.json',
        dateScreen: 'res/publish/DateScreen.json',
    },
    image: {
        info: {
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
    res.json.playerResultPanel,
    res.json.cursor,
    res.json.dateScreen,
];

function addNumberedResources(directory, range, extension) {
    var resources = {};
    _.each(range, function (i) {
        resources[i] = 'res/' + directory + '/' + i + '.' + extension;
    });
    _.each(resources, function (resource) {
        g_resources.push(resource);
    });
    return resources;
}

res.image.info.heroines = addNumberedResources('info/heroine', _.range(8), 'png');
res.image.info.heroineBackgrounds = addNumberedResources('info/heroineBackground', _.range(8), 'png');
res.image.info.hearts = addNumberedResources('info/heart', _.range(4), 'png');
res.image.info.revealedBars = addNumberedResources('info/bar/revealed', _.range(4), 'png');
res.image.info.realBars = addNumberedResources('info/bar/real', _.range(4), 'png');
res.image.info.enthusiasms = addNumberedResources('info/enthusiasm', _.range(3, 6 + 1), 'png');
res.image.info.playerBackgrounds = addNumberedResources('info/playerBackground', _.range(4), 'png');
res.image.date.heroines = addNumberedResources('date/heroine', _.range(8), 'png');
res.image.date.backgrounds = addNumberedResources('date/background', _.range(8), 'png');
res.image.date.faces = addNumberedResources('date/face', _.range(8), 'png');
res.image.date.targetBackgrounds = addNumberedResources('date/targetBackground', _.range(4), 'png');
