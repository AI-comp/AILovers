var res = {
    HeroinePanel_json: 'res/publish/HeroinePanel.json',
    DatePanel_json: 'res/publish/DatePanel.json',
    ControlPanel_json: 'res/publish/ControlPanel.json',
    MainScene_json: 'res/MainScene.json',
    DateScene_json: 'res/DateScene.json',
};

var g_resources = [
    res.HeroinePanel_json,
    res.DatePanel_json,
    res.ControlPanel_json,
    res.MainScene_json,
    res.DateScene_json,
];

res.faceImages = _.map(_.range(10), function (i) {
    return 'res/face/' + i + '.png';
});
res.dateImages = _.map(_.range(10), function (i) {
    return 'res/date/' + i + '.png';
});

for (var i = 0; i < 10; i++) {
    g_resources.push(res.faceImages[i]);
    g_resources.push(res.dateImages[i]);
}