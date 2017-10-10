MainGame.Game = function (game) {
    //declare a few 'global' variables here
    
    //variables
    this.margin = {
        top: 40,
        bottom: 25,
        left: 300,
        right: 25
    };
    this.cellW = 32;
    this.cellH = 32;
    this.originalSpriteW = 128;
    this.originalSpriteH = 128;
    this.cellAreaW = 30;
    this.cellAreaH = 18;
    
};

MainGame.Game.prototype = {

	create: function () {
        //initialize a few 'global' variables here
        this.resetValues();
        
        this.background = this.add.sprite(0, 0, 'gameBackground');
        this.beep = this.add.audio('beep1');
        this.backgroundMusic = this.add.audio('backgroundMusic');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3;
        
        //create boundaries
        this.createBoundaries();
        //create player
        this.createPlayer();
        //create randmon fruit
        this.createFruit();
        this.createUI();
        this.updateScoreSpeed();
    },
    
    resetValues: function(){
        //objects
        this.background = null;
        this.boundaries = null;
        this.player = null;
        this.tail = [];
        this.fruit = null;
        this.scoreText = "";
        this.speedText = "";
        this.youLoseSprite = null;
        this.digitalStartButton = null;
        
        this.digitalPadUp = null;
        this.digitalPadDown = null;
        this.digitalPadLeft = null;
        this.digitalPadRight = null;
        
        this.baseSpeed = 50;
        this.minSpeed = 100;
        this.moveLoked = false;
        
        this.gameState = "initial";
        this.score = 0;
        this.speed = 1;
        this.speedMod = 5;
        this.speed = this.speed + this.speedMod;
        this.oldDirection = null;
        this.restartGame = false;
        
        this.baseWaitingTime = 500;
        this.moveWaitingTime = 500;
        this.elapsedMoveTime = 0;
    },

    startGame: function(){

    },
    
    update: function(){
      
      this.oldDirection = this.player.direction;
      //update player direction

      if (this.gameState == "playing") {
          this.checkKeyboardInput();
      }
        
      //move player
      this.movePlayer();
          
      this.checkPlayerCollides();
      this.updateFruitPosition();
      this.checkPlayerTouchFruit();
        
    },
    
    checkKeyboardInput: function(){
        if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT) && this.player.direction != "right" && !this.moveLoked)
        {
            this.player.direction = "left";
            this.moveLoked = true;
        }
        else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && this.player.direction != "left" && !this.moveLoked)
        {
            this.player.direction = "right";
            this.moveLoked = true;
        }
        else if (this.input.keyboard.isDown(Phaser.Keyboard.UP) && this.player.direction != "down" && !this.moveLoked)
        {
            this.player.direction = "up";
            this.moveLoked = true;
        }
        else if (this.input.keyboard.isDown(Phaser.Keyboard.DOWN) && this.player.direction != "up" && !this.moveLoked)
        {
            this.player.direction = "down";
            this.moveLoked = true;
        }
    },
    
    movePlayer:  function(){
        if (this.gameState == "playing") {
          deltaTime = 0;
          deltaTime = this.time.elapsed;
          this.elapsedMoveTime +=deltaTime;
          if(this.elapsedMoveTime >= this.moveWaitingTime){
              this.elapsedMoveTime = 0;
              this.updatePlayerPosition();
              this.moveLoked = false;
          }
        }
    },
    
    updatePlayerPosition: function(){
      
      var oldPosX = this.player.pos.x;
      var oldPosY = this.player.pos.y;
      
      if(this.player.direction === "up"){
          this.player.pos.y -= 1;
      }
      
      if(this.player.direction === "down"){
          this.player.pos.y += 1;
      }
      
      if(this.player.direction === "left"){
          this.player.pos.x -= 1;
      }
      
      if(this.player.direction === "right"){
          this.player.pos.x += 1;
      }
      
      //update render position
      this.player.x = this.margin.left+(this.player.pos.x*this.cellW);
      this.player.y = this.margin.top+(this.player.pos.y*this.cellH);
      
      var tailLength = this.tail.length;
      
      for (x=0; x<tailLength; x++) {
          newPosX = this.tail[x].pos.x;
          newPosY = this.tail[x].pos.y;
          newDirection = this.tail[x].direction;
          
          this.tail[x].pos.x = oldPosX;
          this.tail[x].pos.y = oldPosY;
          this.tail[x].direction = this.oldDirection;
          
          this.tail[x].x = this.margin.left+(oldPosX*this.cellW);
          this.tail[x].y = this.margin.top+(oldPosY*this.cellH);
          
          oldPosX = newPosX;
          oldPosY = newPosY;
          this.oldDirection = newDirection;
      }
        
    },
    
    updateTailPosition: function(){
        
    },
    
    updateFruitPosition: function (){
      this.fruit.x = this.margin.left+(this.fruit.pos.x*this.cellW);
      this.fruit.y = this.margin.top+(this.fruit.pos.y*this.cellH);
    },
    
    checkPlayerCollides: function(){
        if(this.player.pos.x > this.cellAreaW-1
        || this.player.pos.x < 0
        || this.player.pos.y > this.cellAreaH-1
        || this.player.pos.y < 0){
            this.gameState = "gameover";
            this.restartGame = true;
            this.digitalStartButton.inputEnabled = true;
            this.digitalStartButton.alpha = 1;
            
            this.youLoseSprite = this.add.sprite(this.world.centerX, this.world.centerY, 'youlose');
            this.youLoseSprite.anchor.setTo(0.5,0.5);
            this.youLoseSprite.z = 1000;
            this.backgroundMusic.pause();
            return;
        }
        
        for (x = 0; x < this.tail.length; x++){
            if(this.tail[x].pos.x === this.player.pos.x && this.tail[x].pos.y === this.player.pos.y){
                this.gameState = "gameover";
                this.restartGame = true;
                this.digitalStartButton.inputEnabled = true;
                this.digitalStartButton.alpha = 1;
                
                this.youLoseSprite = this.add.sprite(this.world.centerX, this.world.centerY, 'youlose');
                this.youLoseSprite.anchor.setTo(0.5,0.5);
                this.youLoseSprite.alpha = 0;
                this.youLoseSprite.z = 1000;
                this.backgroundMusic.pause();
                return;
            }
        }
        
    },
    
    checkPlayerTouchFruit: function(){
        if (this.player.pos.x === this.fruit.pos.x && this.player.pos.y === this.fruit.pos.y) {
            this.beep.play();
            this.score += 1;
            this.updateScoreSpeed();
            this.resetFruitPosition();
            this.addTail();
        }
    },
    
    updateScoreSpeed: function() {
        
        this.speed = Math.floor(this.score/5) + this.speedMod;
        var speedIncremental = this.speed * this.baseSpeed;
        
        this.moveWaitingTime = this.baseWaitingTime - speedIncremental;
        
        if (this.moveWaitingTime <= this.minSpeed){
            this.moveWaitingTime = this.minSpeed;
        }
        
        
        
        this.speedText.setText("Speed: "+(this.speed-this.speedMod));
        this.scoreText.setText("Score: "+this.score);
    },
    
    addTail: function(){
        
        var xPos = 0;
        var yPos = 0;
        var direction = "";
        //direction = this.player.direction;
        if (this.tail.length <= 0) {
            xPos = this.player.pos.x;
            yPos = this.player.pos.y;
            direction = this.player.direction;
        }else{
            xPos = this.tail[this.tail.length-1].pos.x;
            yPos = this.tail[this.tail.length-1].pos.y;
            direction = this.tail[this.tail.length-1].direction;
        }
        
        
        if(direction === "up"){
          yPos += 1;
        }
        if(direction === "down"){
          yPos -= 1;
        }
        if(direction === "left"){
          xPos += 1;
        }
        if(direction === "right"){
          xPos -= 1;
        }
        
        var newTail = this.add.sprite(this.margin.left+(xPos*this.cellW), this.margin.top+(yPos*this.cellH), 'green_square');
        //newTail.scale.setTo(this.cellW/this.originalSpriteW, this.cellH/this.originalSpriteH);
        //newTail.animations.add('still', [1], 1, true);
        //newTail.animations.play('still');
        newTail.pos = {
            x: xPos,
            y: yPos
        };
        newTail.direction = direction;
        
        this.tail.push(newTail);
        
        

    },
    
    resetFruitPosition: function(){
        xPos = Math.floor((Math.random() * this.cellAreaW-1)+1);
        yPos = Math.floor((Math.random() * this.cellAreaH-1)+1);
        this.fruit.pos = {
            x: xPos,
            y: yPos
        }
    },
    
    createFruit: function(){
        xPos = Math.floor((Math.random() * this.cellAreaW-1)+1);
        yPos = Math.floor((Math.random() * this.cellAreaH-1)+1);
        this.fruit = this.add.sprite(this.margin.left+(xPos*this.cellW), this.margin.top+(yPos*this.cellH), 'red_square');
        //this.fruit.scale.setTo(this.cellW/this.originalSpriteW, this.cellH/this.originalSpriteH);
        //this.fruit.animations.add('still', [3], 3, true);
        //this.fruit.animations.play('still');
        this.fruit.pos = {
            x: xPos,
            y: yPos
        }
    },
    
    createPlayer: function(){
        xPos = 7;//Math.floor((Math.random() * this.cellAreaW-1)+1);
        yPos = 7;//Math.floor((Math.random() * this.cellAreaH-1)+1);
        this.player = this.add.sprite(this.margin.left+(xPos*this.cellW), this.margin.top+(yPos*this.cellH), 'purple_square');
        //this.player.scale.setTo(this.cellW/this.originalSpriteW, this.cellH/this.originalSpriteH);
        //this.player.animations.add('still', [2], 2, true);
        //this.player.animations.play('still');
        this.player.direction = "right";
        this.player.pos ={
            x: xPos,
            y: yPos
        };
        this.addTail();
        this.addTail();
        this.addTail();
        this.addTail();
    },
    
    createBoundaries: function(){
        this.boundaries = this.add.group();
        //Create top boundaries
        for (x=0; x<this.cellAreaW; x++) {
            var boundaryCell = this.add.sprite((this.cellW*x)+this.margin.left, this.margin.top, 'backgrounds');
            
            if (x === 0) {
                boundaryCell.animations.add('still', [5], 5, true);
            } else if (x === this.cellAreaW-1) {
                boundaryCell.animations.add('still', [7], 7, true);
            } else {
                boundaryCell.animations.add('still', [6], 6, true);
            }
            
            boundaryCell.scale.setTo(this.cellW/this.originalSpriteW, this.cellH/this.originalSpriteH);
            boundaryCell.animations.play('still');
        }

        
        //Create bottom boundaries
        for (x=0; x<this.cellAreaW; x++) {
            var boundaryCell = this.add.sprite((this.cellW*x)+this.margin.left, this.margin.top+((this.cellAreaH-1)*this.cellW), 'backgrounds');
            
            if (x === 0) {
                boundaryCell.animations.add('still', [39], 39, true);
            } else if (x === this.cellAreaW-1) {
                boundaryCell.animations.add('still', [41], 41, true);
            } else {
                boundaryCell.animations.add('still', [40], 40, true);
            }
            
            boundaryCell.scale.setTo(this.cellW/this.originalSpriteW, this.cellH/this.originalSpriteH);
            boundaryCell.animations.play('still');
        }
        
        //Create left boundaries
        for (x=0; x<this.cellAreaH; x++) {
            var boundaryCell = this.add.sprite(this.margin.left, (this.cellH*x)+this.margin.top, 'backgrounds');
            
            if (x === 0) {
                boundaryCell.animations.add('still', [5], 5, true);
            } else if (x === this.cellAreaH-1) {
                boundaryCell.animations.add('still', [39], 39, true);
            } else {
                boundaryCell.animations.add('still', [22], 22, true);
            }
            
            boundaryCell.scale.setTo(this.cellW/this.originalSpriteW, this.cellH/this.originalSpriteH);
            boundaryCell.animations.play('still');
        }
        
        //Create right boundaries
        for (x=0; x<this.cellAreaH; x++) {
            var boundaryCell = this.add.sprite(this.margin.left+((this.cellAreaW-1)*this.cellW), (this.cellH*x)+this.margin.top, 'backgrounds');
            
            if (x === 0) {
                boundaryCell.animations.add('still', [7], 7, true);
            } else if (x === this.cellAreaH-1) {
                boundaryCell.animations.add('still', [41], 41, true);
            } else {
                boundaryCell.animations.add('still', [24], 24, true);
            }
            
            boundaryCell.scale.setTo(this.cellW/this.originalSpriteW, this.cellH/this.originalSpriteH);
            boundaryCell.animations.play('still');
        }
        
        
        //Create inside body
        for (x=1; x<(this.cellAreaW-1); x++) {
            for (y=1; y<(this.cellAreaH-1); y++) {
                
                var boundaryCell = this.add.sprite((this.cellW*x)+this.margin.left, (this.cellH*y)+this.margin.top, 'backgrounds');
            
                boundaryCell.animations.add('still', [23], 23, true);
            
                boundaryCell.scale.setTo(this.cellW/this.originalSpriteW, this.cellH/this.originalSpriteH);
                boundaryCell.animations.play('still');
                
            }
        }
        
    },
    
    createUI: function(){
        
        //set scores and speed
        var style = {
                align: "center",
                font: "bold 32px Arial",
                fill: "#000",
                boundsAlignH: "center",
                boundsAlignV: "middle"
            };
        this.scoreText = this.add.text(20, 40, "Score: " + this.score, style);
        this.speedText = this.add.text(20, 85, "Speed: " + this.speed, style);
        
        this.digitalPadUp = this.add.sprite(100, this.world.height-310, 'digitalPadUp');
        this.digitalPadUp.direction = "up";
        this.digitalPadUp.inputEnabled = true;
        this.digitalPadUp.events.onInputDown.add(this.digitalPadTouched, this);
        
        this.digitalPadDown = this.add.sprite(100, this.world.height-190, 'digitalPadDown');
        this.digitalPadDown.direction = "down";
        this.digitalPadDown.inputEnabled = true;
        this.digitalPadDown.events.onInputDown.add(this.digitalPadTouched, this);
        
        this.digitalPadRight = this.add.sprite(150, this.world.height-240, 'digitalPadRight');
        this.digitalPadRight.direction = "right";
        this.digitalPadRight.inputEnabled = true;
        this.digitalPadRight.events.onInputDown.add(this.digitalPadTouched, this);
        
        this.digitalPadLeft = this.add.sprite(35, this.world.height-240, 'digitalPadLeft');
        this.digitalPadLeft.direction = "left";
        this.digitalPadLeft.inputEnabled = true;
        this.digitalPadLeft.events.onInputDown.add(this.digitalPadTouched, this);
        
        
        this.digitalStartButton = this.add.sprite(20, this.world.height-580, 'digitalStartButton');
        this.digitalStartButton.inputEnabled = true;
        this.digitalStartButton.events.onInputDown.add(this.digitalStartTouched, this);
        

    },
    
    digitalPadTouched: function(digitalPad){
        
        if(this.gameState !== "playing"){
            return;
        }
        
        if (digitalPad.direction === "left" && this.player.direction != "right" && !this.moveLoked)
        {
            this.player.direction = "left";
            this.moveLoked = true;
        }
        else if (digitalPad.direction === "right" && this.player.direction != "left" && !this.moveLoked)
        {
            this.player.direction = "right";
            this.moveLoked = true;
        }
        else if (digitalPad.direction === "up" && this.player.direction != "down" && !this.moveLoked)
        {
            this.player.direction = "up";
            this.moveLoked = true;
        }
        else if (digitalPad.direction === "down" && this.player.direction != "up" && !this.moveLoked)
        {
            this.player.direction = "down";
            this.moveLoked = true;
        }
    },
    
    digitalStartTouched: function (button){
        
        if(this.restartGame === true && this.gameState === "gameover"){
            this.restartGame = false;
             this.state.start('Game');
             
            return;
        }
        
        this.gameState = "playing";
        button.inputEnabled = false;
        button.alpha = 0;
        this.backgroundMusic.play();
    }

};
