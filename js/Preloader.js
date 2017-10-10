MainGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

MainGame.Preloader.prototype = {

	preload: function () {

		
		this.bck = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBackground');
		this.bck.anchor.setTo(0.5,0.5);
		this.bck.scale.setTo(0.5,0.5);
		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
		this.preloadBar.anchor.setTo(0,0.5);
		this.preloadBar.scale.setTo(0.5,1);
		this.preloadBar.x = this.world.centerX - this.preloadBar.width/2;
		
		
		this.load.setPreloadSprite(this.preloadBar);

		//this.load.atlas('spriteset', 'assets/img/textures.png', 'assets/spriteset.jsona');
		//this.load.spritesheet('objects', 'assets/img/textures.png', 384, 384);
		//this.load.audio('sfx', ['assets/sound/sfx.mp3','assets/sound/sfx.ogg','assets/sound/sfx.wav','assets/sound/sfx.m4a']);
        this.load.image('gameBackground', 'assets/img/background0.png');
        
        this.load.image('digitalPadUp', 'assets/img/upButton.png');
        this.load.image('digitalPadDown', 'assets/img/downButton.png');
        this.load.image('digitalPadLeft', 'assets/img/leftButton.png');
        this.load.image('digitalPadRight', 'assets/img/rightButton.png');
        
        this.load.image('digitalStartButton', 'assets/img/startButton.png');
        this.load.image('youlose', 'assets/img/youlose.png');
        
        this.load.image('purple_square', 'assets/img/purple_square.png');
        this.load.image('green_square', 'assets/img/green_square.png');
        this.load.image('red_square', 'assets/img/red_square.png');
        this.load.spritesheet('backgrounds', 'assets/img/mapPack_tilesheet_2X.png', 128, 128);
        
        this.load.audio('beep1', 'assets/sound/Confirm.wav');
        this.load.audio('backgroundMusic', 'assets/music/Jungle.wav');

	},

	create: function () {

		this.preloadBar.cropEnabled = false;
		
		

	},

	update: function () {
		if (this.cache.isSoundDecoded('beep1') && this.ready == false)
		{
			this.ready = true;
			this.state.start('Game');
		}
	}

};
