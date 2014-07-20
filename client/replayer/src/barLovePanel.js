var BarLovePanel = LovePanel.extend({
    ctor: function (playerIndex, maxLove) {
        this._super(res.json.barLovePanel);

        this.innerPanel.getChildByName('RevealedLoveBar').loadTexture(res.image.info.revealedBars[playerIndex]);
        this.innerPanel.getChildByName('RealLoveBar').loadTexture(res.image.info.realBars[playerIndex]);

        this.maxLove = maxLove <= 15 ? 15 : 45;
        this.innerPanel.setBackGroundImage(res.image.info['loveMeasure' + this.maxLove]);
    },

    setLove: function (revealedLove, realLove) {
        this._super(revealedLove, realLove);

        this.innerPanel.getChildByName('RevealedLoveBar').setPercent(revealedLove / this.maxLove * 100);
        this.innerPanel.getChildByName('RealLoveBar').setPercent(realLove / this.maxLove * 100);
    },
});