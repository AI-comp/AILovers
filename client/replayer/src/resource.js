var res = {
    json: {
        heroinePanel: 'res/publish/HeroinePanel.json',
        datePanel: 'res/publish/DatePanel.json',
        controlPanel: 'res/publish/ControlPanel.json',
        mainScene: 'res/MainScene.json',
        dateScene: 'res/DateScene.json',
        cursor: 'res/cursor.json',
    },
    image: {
    },
};

var g_resources = [
    res.json.heroinePanel,
    res.json.datePanel,
    res.json.controlPanel,
    res.json.mainScene,
    res.json.dateScene,
    res.json.cursor,
];

res.image.faces = _.map(_.range(10), function (i) {
    return 'res/face/' + i + '.png';
});
res.image.dates = _.map(_.range(10), function (i) {
    return 'res/date/' + i + '.png';
});

for (var i = 0; i < 10; i++) {
    g_resources.push(res.image.faces[i]);
    g_resources.push(res.image.dates[i]);
}