var res = {
    json: {
        heroinePanel: 'res/publish/HeroinePanel.json',
        datePanel: 'res/publish/DatePanel.json',
        controlPanel: 'res/publish/ControlPanel.json',
        lovePanel: 'res/publish/LovePanel.json',
        mainScene: 'res/MainScene.json',
        dateScene: 'res/DateScene.json',
        cursor: 'res/Cursor.json',
    },
    image: {
    },
};

var g_resources = [
    res.json.heroinePanel,
    res.json.datePanel,
    res.json.controlPanel,
    res.json.lovePanel,
    res.json.mainScene,
    res.json.dateScene,
    res.json.cursor,
];

res.image.heroines = _.map(_.range(10), function (i) {
    return 'res/heroine/' + i + '.png';
});
res.image.hearts = _.map(_.range(4), function (i) {
    return 'res/heart/' + i + '.png';
});
res.image.dates = _.map(_.range(10), function (i) {
    return 'res/date/' + i + '.png';
});
res.image.faces = _.map(_.range(10), function (i) {
    return 'res/face/' + i + '.png';
});

_.each(res.image.heroines, function (resource) {
    g_resources.push(resource);
});
_.each(res.image.hearts, function (resource) {
    g_resources.push(resource);
});
_.each(res.image.dates, function (resource) {
    g_resources.push(resource);
});
_.each(res.image.faces, function (resource) {
    g_resources.push(resource);
});
