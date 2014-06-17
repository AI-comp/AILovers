var BarLovePanel = LovePanel.extend({
    ctor: function (playerIndex) {
        this._super(res.json.barLovePanel);

        this.innerPanel.getChildByName('RevealedLoveBar').loadTexture(res.image.revealedBars[playerIndex], ccui.Widget.LOCAL_TEXTURE);
        this.innerPanel.getChildByName('RealLoveBar').loadTexture(res.image.realBars[playerIndex], ccui.Widget.LOCAL_TEXTURE);
    },

    setLove: function (revealedLove, realLove) {
        this._super(revealedLove, realLove);

        this.innerPanel.getChildByName('RevealedLoveBar').setPercent(revealedLove / 45 * 100);
        this.innerPanel.getChildByName('RealLoveBar').setPercent(realLove / 45 * 100);
    },
});