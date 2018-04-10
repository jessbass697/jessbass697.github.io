
MysticMac.Game = function (game) {
    
};

var lives; //global variable for all functions to be able to use so outside of the create function


MysticMac.Game.prototype = {
    
    init: function() {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 1000;
        
        this.world.setBounds(0, 0, 540, 960); //sets the bounds of the game to the width and height of screen so player cannot go any further.
        
        this.RUNNING_SPEED = 180; // the speed which the player moves.
        this.JUMPING_SPEED = 600; // the height the player can jump.
    },
    
    //creates all the elements of the game and sets out how the stage will look and how the players and enemies react to the elements of the stage.
    create: function() {
      
        //adds in background image, the ground, and audio from the preloader
        this.add.image(0, 0, 'ufc');
        this.ground = this.add.sprite(0, 800, 'ground'); //adds the ground in and adds a y position
        this.physics.arcade.enable(this.ground); //allows for collisions later in game
        this.ground.body.allowGravity = false; //does not allow the ground to be influenced by gravity, it will always remain in the same position
        this.ground.body.immovable = true; //ground never moves
        this.background = this.add.audio('bgm');
        this.background.play('', 0, 0.3, false);
        this.jump = this.add.audio('jump');
        this.die = this.add.audio('death');
        this.youwin = this.add.audio('youwin');
        
        //gets the level data from the json file that was loaded into preloader.js
        this.levelData = JSON.parse(this.game.cache.getText('level'));
        
        // platforms group
        this.platforms = this.add.group();
        this.platforms.enableBody = true; //allows for collisions
        //calls the platform data from the json file which holds the x and y coordinates of each platform and sets them out in the game for each given coodinate by the json file
        this.levelData.platformData.forEach(function(element) {
        this.platforms.create(element.x, element.y, "platform");
        }, this);
        this.platforms.setAll("body.immovable", true); //sets all platforms so they do not move
        this.platforms.setAll("body.allowGravity", false); //sets all the platforms to not be affected by gravity
        
        //Gloves Group
        this.gloves = this.add.group(); //creates a new group for the glove element
        this.gloves.enableBody = true; //allows for collisions
        
        //calls the gloveData from the json file which holds x and y coordinates for the gloves
        var glove;
        this.levelData.gloveData.forEach(function(element) {
            glove = this.gloves.create(element.x, element.y, 'gloves'); //creates gloves using the json file data and x and y coordinates
            glove.animations.add('gloves', [0, 1], 4, true); //creates an animates from the glove sprite sheet so the gloves move slightly
            glove.play('gloves'); //starts the animation
        }, this);
        this.gloves.setAll('body.allowGravity', false); //sets all gloves to not be affected by gravity
        
        //Enemy Data (Conor McGregor at the top of the game)
        //adds in the conor mcgreger spritesheet and uses the json file data to position him at the top of the level in the game
        this.enemy = this.add.sprite(this.levelData.enemy.x, this.levelData.enemy.y, 'enemy'); 
        this.physics.arcade.enable(this.enemy); //allows for collisions
        this.enemy.animations.add('enemy', [0, 1], 4, true);
        this.enemy.body.allowGravity = false; //sets enemy to not be affected by gravity
        
        
        //Player Data
        this.player = this.add.sprite(10, 700, 'player', 3); //adds in the player spritesheet and sets his position on screen
        this.player.anchor.setTo(0.5); 
        this.player.animations.add('walk', [0, 1, 2, 1], 6, true); //gets frames from the spritesheet to make him walk
        this.physics.arcade.enable(this.player); //allows for collisions
        this.player.customParams = {};
        this.player.body.collideWorldBounds = true; //the player cannot go past the world bounds set earlier, he will not be able to go offscreen
        
        //Belt Group
        this.belt = this.add.group(); //creates new belt group
        this.belt.enableBody = true; //allows for collisions
        this.createBelt(); //creates a new belt function 
        
        this.beltCreater = this.game.time.events.loop(Phaser.Timer.SECOND * this.levelData.beltFrequency, this.createBelt, this); 
    
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.createOnscreenControls();
        
        //lives group
        lives = game.add.group();

        stateText = game.add.sprite(game.world.centerX, game.world.centerY, 'over'); //Centres the game over to the center of the game stage
        stateText.anchor.setTo(0.5, 0.5); 
        stateText.visible = false; //text is hidden until the game over event occurs
        
        winText = game.add.sprite(game.world.centerX, game.world.centerY, 'win');
        winText.anchor.setTo(0.5, 0.5);
        winText.visible = false;
    
        
        for (var i = 0; i<3; i++) { //for loop to create three hearts for lives
            var heart = lives.create(game.world.width - 100 + (30 * i), 60, 'lives'); //positions the lives at the top of the screen
            heart.anchor.setTo(0.5, 0.5);
        }
        
        
    },
    
    update: function() { //update function contains the code to perform actions in the game.  
        this.physics.arcade.collide(this.player, this.platforms); //player is able to collide with the platform so it doesn't fall through the platform
        this.physics.arcade.collide(this.player, this.ground); //player is able to collide with the ground
        
        this.physics.arcade.collide(this.belt, this.platforms); //belt collides with the platforms
        this.physics.arcade.collide(this.belt, this.ground); //belt collides with the ground
        
        //when the player collides with the gloves or the belt, it invokes the enemyHitsPlayer function
        this.physics.arcade.overlap(this.player, this.gloves, this.enemyHitsPlayer, null, this); 
        this.physics.arcade.overlap(this.player, this.belt, this.enemyHitsPlayer, null, this);
        
        //when the player collides with the enemy it invokes the win function
        this.physics.arcade.overlap(this.player, this.enemy, this.win, null, this);
        
        
        this.player.body.velocity.x = 0;
        if (this.cursors.left.isDown || this.player.customParams.movingLeft) {
            this.player.body.velocity.x = -this.RUNNING_SPEED;
            this.player.scale.setTo(-1, 1);
            this.player.play('walk');
        }
        else if (this.cursors.right.isDown || this.player.customParams.movingRight) {
            this.player.body.velocity.x = this.RUNNING_SPEED;
            this.player.scale.setTo(1, 1);
            this.player.play('walk');
        }
        else {
            this.player.animations.stop();
            this.player.frame = 0;
        }
        
        if ((this.cursors.up.isDown || this.player.customParams.mustJump) && this.player.body.touching.down) {
            this.player.body.velocity.y = -this.JUMPING_SPEED;
            this.player.customParams.mustJump = false;
            this.jump.play();
        }
        
        this.belt.forEach(function(belt) {
            if(belt.x < 10 && belt.y > 700) { //if belt is < 10 in the x coordinate and more than 700 in the y coordinate
                belt.kill(); //kill the belt makes the belt disappear
            }
        }, this);
        
    },
    
    createOnscreenControls: function() {
        this.leftArrow = this.add.button(20, 880, 'leftArrow');
        this.leftArrow.alpha = 0.5;
        
        this.rightArrow = this.add.button(180, 880, 'rightArrow');
        this.rightArrow.alpha = 0.5;
        
        this.actionButton = this.add.button(400, 880, 'jump');
        this.actionButton.alpha = 0.5;
        
        this.leftArrow.events.onInputDown.add(function() {
            this.player.customParams.movingLeft = true;
        }, this);
        this.leftArrow.events.onInputUp.add(function() {
            this.player.customParams.movingLeft = false;
        }, this);

        this.leftArrow.events.onInputOver.add(function() {
            this.player.customParams.movingLeft = true;
        }, this);
        this.leftArrow.events.onInputOut.add(function() {
            this.player.customParams.movingLeft = false;
        }, this);

        // right
        this.rightArrow.events.onInputDown.add(function() {
            this.player.customParams.movingRight = true;
        }, this);
        this.rightArrow.events.onInputUp.add(function() {
            this.player.customParams.movingRight = false;
        }, this);

        this.rightArrow.events.onInputOver.add(function() {
            this.player.customParams.movingRight = true;
        }, this);
        this.rightArrow.events.onInputOut.add(function() {
            this.player.customParams.movingRight = false;
        }, this);

        // jump
        this.actionButton.events.onInputDown.add(function() {
            this.player.customParams.mustJump = true;
        }, this);
        this.actionButton.events.onInputUp.add(function() {
            this.player.customParams.mustJump = false;
        }, this);
    
    },
    
    //What happens when an enemy object hits the player
    //This is supposed to destroy 1 life but the lives all disappear and the player dies, I didn't know how to fix it 
    enemyHitsPlayer: function(player, gloves) {
        live = lives.getFirstAlive();
        console.log(live)
        if (live) {
            live.destroy();
        
        }
        
        //When the lives run out, the player dies and gameover text appears
        if (lives.countLiving() < 1) { 
            player.kill();
        
            
            stateText.visible = true; //states the gameover text to visible
            this.background.stop(); //stops the background music from playing when the player dies
            this.die.play(); //plays a death soundeffect
            
            //when user touches the screen the game restarts
            game.input.onTap.addOnce(function() { 
                game.state.restart();
            }, this);
        }
          
    },
    
    //function for what happens when the player reaches the enemy
    win: function(player, enemy) {
        player.kill(); //player disappears from screen because the objects are still moving and game was still going in the background
        winText.visible = true; //win text is now visible
        this.background.stop(); //stops the background music from playing
        this.youwin.play(); //plays the win soundeffect
        
        //when player touches the screen the game restarts
        game.input.onTap.addOnce(function() {
            game.state.restart();
        }, this);
    },
    
    //function for creating belts that the enemy throws at the player
    createBelt: function() {
        // get first dead sprite
        var belt = this.belt.getFirstExists(false);

        if(!belt) {
        belt = this.belt.create(0, 0, "belt");
        }

        belt.reset(this.levelData.enemy.x, this.levelData.enemy.y);
        belt.body.velocity.x = this.levelData.beltSpeed;
        belt.body.collideWorldBounds = true;
        belt.body.bounce.set(1, 0);

    },
    
    restart: function() {
        lives.callAll('revive');
        
        this.player.revive();
        stateText.visible = false;
    }
    
 
};