MysticMac.StartMenu = function(game) {
    this.startBG; //loads the background image upon opening the game
    this.startPrompt; //loads the title text when the game opens
    this.music; //starts the title music
}

MysticMac.StartMenu.prototype = {
    
    create: function () {
        this.music= this.add.audio('startMusic'); //loads in audio from the preloader.js
        this.music.play(); //function to start the music
        startBG = this.add.image(0,0, 'titlescreen'); // 0,0 are the x and y coordinates 
        startBG.inputEnabled = true; //This allows mouse clicks and touches
        startBG.events.onInputDown.addOnce(this.startGame, this); //binding an event handler to the background
    
        startPrompt = this.add.bitmapText(this.world.centerX-155, this.world.centerY+10, 'eightbitwonder', 'Touch to Start!', 24); //Touch to Start is what the screen will read and 24 is the size that it will be rendered
    },
    
    //Create is a function built into phaser while startGame function is one that the developer has created
    
        //When a click is detected the game will start 
        startGame: function (pointer) {
            this.music.stop(); //function that stops the title music when the user begins the game
            this.state.start('Game'); //moves from the StartMenu state to the Game state. 
    }
    
};
    