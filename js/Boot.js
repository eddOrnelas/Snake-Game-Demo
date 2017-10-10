var MainGame = {};

//declare global variables
//var playmusic = true;

MainGame.Boot = function (game) {

};

MainGame.Boot.prototype = {

    preload: function () {
        this.load.image('preloaderBackground', 'assets/img/preloadbck.png');
        this.load.image('preloaderBar', 'assets/img/preloadbar.png');
    },

    create: function () {

        if (this.game.device.desktop)
        {
            //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            //this.scale.pageAlignHorizontally = true;
        }
        else
        {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.minWidth = 640;
            this.scale.minHeight = 360;
            this.scale.maxWidth = 1920;
            this.scale.maxHeight = 1080;
            this.scale.forceLandscape = false;
            this.scale.pageAlignHorizontally = true;
        }

        this.scale.updateLayout(true);
        this.state.start('Preloader');

    }

};
