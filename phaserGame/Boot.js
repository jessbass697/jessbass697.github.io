var MysticMac = {};

MysticMac.Boot = function(game) {};

MysticMac.Boot.prototype = {
    preload:function() {
        this.load.image('preloaderBar', 'images/loader_bar.png');
        this.load.image('titleimage', 'images/TitleImage.png');
        
    }, //preload tries to preload items before the create event happens
    
    create: function() {
    //These variables are set up once and don't have to be dealt with again. Variables that will most likely never change
    
    //this, refers to the function above which is game
    this.input.maxPointers = 1; //Only ever going to have 1 pointer activated at a time. 
    this.stage.disableVisibilityChange = false; //Pauses the game
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.minWidth = 270;
    this.scale.minHeight = 480;
    //aglining the page, absolutely centers the game
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.stage.forcePortrait = true;
    this.scale.setScreenSize(true);
    
    this.input.addPointer();
    this.stage.backgroundColor = '#171642';
        
    this.state.start('Preloader');
  }

};

