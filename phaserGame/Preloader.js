MysticMac.Preloader = function(game) {
    //preloader function begains without the preload bar, titleText as the game isn't ready yet
    this.preloadBar = null;
    this.titleText = null;
    this.ready = false;
};

MysticMac.Preloader.prototype = {
    
    preload: function () {
    
    //world.centreX is the centre of the game world on the x axis, this is the same for centerY, this will center the preload bar into the center of the screen 
        
    //loads all images, spritesheets, audio and fonts that will be used in the game
        
        this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
        this.preloadBar.anchor.setTo(0.5, 0.5);
        this.load.setPreloadSprite(this.preloadBar);
        this.titleText = this.add.image(this.world.centerX, this.world.centerY-220, 'titleimage');
        this.titleText.anchor.setTo(0.5, 0.5);
        this.load.image('titlescreen', 'images/background.png');
        this.load.bitmapFont('eightbitwonder', 'fonts/eightbitwonder.png', 'fonts/eightbitwonder.fnt');
        this.load.image('ufc', 'images/backgroundImg.png');
        this.load.image('ground', 'images/ground.png');
        this.load.image('platform', 'images/platform.png');
        this.load.image('enemy', 'images/enemy.png');
        this.load.image('belt', 'images/Belt.png');
        this.load.image('rightArrow', 'images/right-arrow.png');
        this.load.image('leftArrow', 'images/left-arrow.png');
        this.load.image('jump', 'images/up-arrow.png');
        this.load.image('lives', 'images/heart.png');
        this.load.image('over', 'images/gameover.png');
        this.load.image('win', 'images/winText.png');
        this.load.image('cover', 'images/backgroundCover.png');
        this.load.audio('startMusic', 'audio/menuMusic.mp3');
        this.load.audio('jump', 'audio/jump.mp3');
        this.load.audio('death', 'audio/death.mp3');
        this.load.audio('bgm', 'audio/bgm.mp3');
        this.load.audio('youwin', 'audio/youWin.mp3');
        
        this.load.spritesheet('player', 'images/player-spritesheet.png', 28, 30, 5, 1, 1);
        this.load.spritesheet('gloves', 'images/gloves-spritesheet.png', 20, 21, 2, 1, 1);
        
        this.load.text('level', 'level.json'); //loads in the external json file that holds the data of for the game
    },
    
    create: function () {
        this.preloadBar.cropEnabled = false;
    },
        
    update: function () {
        this.ready = true; //the game is now ready so the boolean is changed to true
        this.state.start('StartMenu'); //the game will begin in the StartMenu state.
            
    }
};