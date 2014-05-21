var BarLovePanel = LovePanel.extend({
    ctor: function () {
        this._super(res.json.barLovePanel);
    },

    setLove: function (revealedLove, realLove) {
        this._super(revealedLove, realLove);

        this.innerPanel.getChildByName('LoveBar').setPercent((revealedLove + realLove) / 45 * 100);
    },
});