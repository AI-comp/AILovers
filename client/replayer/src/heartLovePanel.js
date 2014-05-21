var HeartLovePanel = LovePanel.extend({
    ctor: function (heartResource) {
        this._super(res.json.heartLovePanel);
        this.heartResource = heartResource;
    },

    setLove: function (revealedLove, realLove) {
        this._super(revealedLove, realLove);

        if (revealedLove >= 10) {
            this.innerPanel.getChildByName('HeartImage10').loadTexture(this.heartResource);
        }
        _(revealedLove % 10).times(function (heartIndex) {
            this.innerPanel.getChildByName('HeartImage' + (heartIndex + 1)).loadTexture(this.heartResource);
        }, this);
    },
});