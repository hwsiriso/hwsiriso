// Setup, Display the game, Create a scene, Start the game, Test the game, Add the player, Move the player
class GameScene {

  preload() {
	  
	  this.load.spritesheet('player', 'assets/player_sheet.png',
                            {frameWidth: 25, frameHeight: 25});
      this.load.image('wallV', 'assets/wallVertical.png');
      this.load.image('wallH', 'assets/wallHorizontal.png');
      this.load.image('coin1', 'assets/star coin 1.png');
      this.load.image('coin2', 'assets/star coin 2.png');
      this.load.image('coin3', 'assets/star coin 3.png');
      this.load.image('coin4', 'assets/star coin 4.png');
      this.load.image('coin5', 'assets/star coin 5.png');
      this.load.image('coin6', 'assets/star coin 6.png');
      this.load.atlas('invader','assets/invader_atlas.png','assets/invader_atlas.json');
      this.load.tilemapTiledJSON('map','assets/egypt2.json');
      this.load.image('tileset','assets/hieroglyffer (2).png');
      this.load.image('back','assets/Pyramids-Desert.jpg');      
	  
  }

  create() {
 	  
      let baggrund=this.add.image(250,170,'back');

	  this.player = this.physics.add.sprite(50, 100, 'player');
      this.player.setGravityY(500);
      this.player.setScale(0.9);
      this.createWorld();
      this.coinPositions = this.map.getObjectLayer('Positions').objects;
        /*[{x:50, y:310}, {x:450, y:310}, {x:50, y:150}, {x:450, y:150}, {x:250, y:65}, {x:250, y:233}];*/
      
      this.anims.create({
          key: 'coin',
          frames: [
          {key: 'coin1'},
          {key: 'coin2'},
          {key: 'coin3'},
          {key: 'coin4'},
          {key: 'coin5'},
          {key: 'coin6'},
          ],
        frameRate: 7,
        repeat:-1
      });
      
      
      this.anims.create({
          key: 'player_right',
          frames: [{key: 'player', frame: 1},
                  {key: 'player', frame: 2}],
          frameRate: 8,
          repeat:-1
      });
      
       this.anims.create({
          key: 'player_left',
          frames: [{key: 'player', frame: 3},
                  {key: 'player', frame: 4}],
          frameRate: 8,
          repeat:-1
           
       });
      
      this.anims.create({
          key: 'player_stand',
          frames: [{key: 'player', frame: 0}],
          frameRate: 8,
          repeat:-1
           
       });
      
      this.anims.create({
          key:'invade_mover',
          frames: [{key:'invader',frame:"invader-1.png"},
                  {key:'invader',frame:"invader-2.png"}],
          framerate: 4,
          repeat: -1
      });
      
      
      this.coin = this.physics.add.sprite(this.coinPositions[0].x,this.coinPositions[0].y, 'coin1');
      
      this.coin.anims.play('coin');
      this.coin.setScale (0.01);
      
      this.score = 0;
     
      this.style = { font: '20px calibri', fill: '#fff' };
      
      this.scoreText = this.add.text(20, 20, 'score: ' + this.score, this.style); 
      this.bestscoreText = this.add.text(20, 40, 'best score: ' + localStorage.getItem('bestScore'));
      if(localStorage.getItem('bestScore') == null) {
      localStorage.setItem('bestScore', 0);
        }
      this.bestscoreText.setStyle({
                                    fontSize: '20px',
                                    fontFamily: 'Arial',
                                    color: '#ffffff',
                                    backgroundColor: '#9999db'
                                    }
                                    );
	  this.arrow = this.input.keyboard.createCursorKeys();

      this.physics.add.collider(this.player, this.layer);
      this.physics.add.overlap(this.player, this.coin, this.hit, null, this);

      this.enemies= this.physics.add.group({
        maxSize:5,
        gravityY:300,
        bounceX:1,
        defaultKey:'invader'
        });
      
	  this.physics.add.collider(this.enemies, this.layer);
      this.time.addEvent({
          delay:3000,
          loop: true,
          callback: this.addEnemy,
          callbackScope:this
      })

          this.physics.add.overlap(this.player, this.enemies, this.gameOver, null, this);
          this.timer= this.time.addEvent({
          delay:1000,
          loop: true,
          callback: this.timeUpdate,
          callbackScope:this
      })
          this.clock=0;
          this.timerText = this.add.text(20, 100, 'time: ' + this.clock, this.style);console.log(this.clock);
      
          this.tweens.add({
          targets: this.player, 
          delay: 0,
          duration: 800,
          alpha: {from: 0,
                  to: 1
                 }    
          });  
  }

  update() {

   // this.enemies.getChildren().forEach(function (enemy) {
    // add code to perform for each member
     //   if (enemy.y<340){this.enemies.killAndHide(enemy);}
//});
      this.children.each(function(enemy){
          if (enemy.y>340){this.enemies.killAndHide(enemy)};
                          },this);
                                         
	  if (this.arrow.right.isDown) {
		  this.player.setVelocityX(200);
          this.player.anims.play('player_right');
		} 
	  else if(this.arrow.left.isDown) {
		  this.player.setVelocityX(-200);
          this.player.anims.play('player_left');
	  } 
      else {
          this.player.setVelocityX(0);
          this.player.anims.play('player_stand');
      }
      if(this.arrow.up.isDown && this.player.body.onFloor()) {
		  this.player.setVelocityY(-320);
	  }
      if(this.player.y<0 || this.player.y>340){
          //console.log("Game Over")
          this.gameOver();
      }

      
  }
    
    createWorld(){
      this.map = this.add.tilemap('map');
      const tileset = this.map.addTilesetImage('hieroglyffer (2)','tileset');
      this.layer = this.map.createLayer('Tile Layer 1',tileset);
      this.layer.setCollision([2,3,4,16,32,48,64]);
      
        
        /*this.walls=this.physics.add.staticGroup();
        this.walls.create(10, 170, 'wallV');
        this.walls.create(490, 170, 'wallV');
        this.walls.create(100, 10, 'wallH');
        this.walls.create(400, 10, 'wallH');
        this.walls.create(0, 170, 'wallH');
        this.walls.create(500, 170, 'wallH');
        this.walls.create(100, 330, 'wallH');
        this.walls.create(400, 330, 'wallH');
        this.walls.create(250, 85, 'wallH').setScale(1.5,1) .refreshBody();
        this.walls.create(250, 255, 'wallH').setScale(1.5,1) .refreshBody();*/
    }
        hit() {
        let oldPosition;
        for (let i = 0; i < this.coinPositions.length; i++) {
        if (this.coinPositions[i].x == this.coin.x && this.coinPositions[i].y == this.coin.y) {
        oldPosition = this.coinPositions[i];console.log(i);
        this.coinPositions.splice(i, 1);console.log('splice',this.coinPositions);
            
        }
        }
        const newPosition =Phaser.Math.RND.pick(this.coinPositions);
        this.coinPositions.push(oldPosition);console.log('push',this.coinPositions);    
     
    var timeline =
    this.tweens.createTimeline();
         timeline.add(
            {targets: this.player,
            duration: 100,
            scaleX: 1.2, // that scale vertically by 20% 
            scaleY: 1.2, // and scale horizontally by 20%
            yoyo: true, 
            delay: 100});
            
            timeline.add(
            {targets: this.player, 
            duration: 400, 
            angle: 360,
            delay: 60});   
            
            timeline.play();
            
      this.coin.setPosition(newPosition.x,newPosition.y);
      // Increment the score by 10
      this.score += 10;

      // Display the updated score on the screen
      this.scoreText.setText('score: ' + this.score);
            console.log('score',this.score);    
     }
    addEnemy(){
        const velocity=50*Phaser.Math.RND.pick([1,-1]);
        var enemy=this.enemies.get(250, 0);
        console.log(velocity);
        if (enemy==null){
            return;
        }
        else {
            enemy.setTint(0xf8f545).setVelocityX(velocity).setVisible(true).setActive(true);
        } enemy.anims.play('invade_mover',true);
    }
    
    gameOver() {
    this.scene.restart();
    if(this.score > localStorage.getItem('bestScore')) {
    localStorage.setItem('bestScore', this.score);
    }
    console.log("gameover");

    }
    timeUpdate(){
        this.clock++;
        if (this.clock>30){
            this.gameOver();
        }
        else {
        this.timerText.setText( 'time: ' + this.clock, this.style);console.log(this.clock);
        }
    }
}

game = new Phaser.Game({
  width: 500,
  height: 340,
  backgroundColor: '#9999db',
  scene: GameScene,
  physics: { default: 'arcade', 
           arcade: {debug: true}},
  parent: 'game',
  title: "gta6",
  version: "1.0" 
    
});


