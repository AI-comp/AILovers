var BarLovePanel = LovePanel.extend({
    ctor: function (playerIndex, maxLove) {
        this._super(res.json.barLovePanel);

        this.innerPanel.getChildByName('RevealedLoveBar').loadTexture(res.image.revealedBars[playerIndex], ccui.Widget.LOCAL_TEXTURE);
        this.innerPanel.getChildByName('RealLoveBar').loadTexture(res.image.realBars[playerIndex], ccui.Widget.LOCAL_TEXTURE);

        this.maxLove = maxLove <= 15 ? 15 : 45;
        this.innerPanel.setBackGroundImage(res.image['measure' + this.maxLove], ccui.Widget.LOCAL_TEXTURE);
    },

    setLove: function (revealedLove, realLove) {
        this._super(revealedLove, realLove);

        this.innerPanel.getChildByName('RevealedLoveBar').setPercent(revealedLove / this.maxLove * 100);
        this.innerPanel.getChildByName('RealLoveBar').setPercent(realLove / this.maxLove * 100);
    },
});