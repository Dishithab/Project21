 //creating all the variables
 var PLAY = 1;
 var END = 0;
 var gameState = PLAY;
 var girl, girl_running;
 var ground, groundImage;
 var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
 var score=0;
 var jumpSound, collidedSound;
 var gameOver, restart;
 var touches = [];

 function preload()
 {
  //loading the sounds for jumping and getting collided
  jumpSound = loadSound("Images/jump.wav")
  collidedSound = loadSound("Images/collided.wav")
  //loading the animation of the girl running
  girl_running = loadAnimation("Images/GirlRunning2.gif");  
  //loading the image of ground,obstacles,game over and restart
  groundImage = loadImage("Images/BG1.png");
  obstacle1 = loadImage("Images/obstacle1.png");
  obstacle2 = loadImage("Images/obstacle2.png");
  obstacle3 = loadImage("Images/obstacle3.png");
  obstacle4 = loadImage("Images/obstacle4.png");
  gameOverImg = loadImage("Images/gameOver.png");
  restartImg = loadImage("Images/restart.png");
 }

 function setup() 
 {
  //creating the canvas
  createCanvas(windowWidth-5,windowHeight-20);

  //creating the ground and adding velocity to it
  ground = createSprite(width/2,height-30,width,20);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);

  //creating the girl and adding animation to her
  girl = createSprite(60,height-30,20,50);
  girl.addAnimation("running", girl_running);
  //setting the collider and scaling the the girl
  girl.setCollider('circle',0,0,50);
  girl.scale = 1;
  
  //creating the gameOver and adding an image to it
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);

  //creating the restart and adding an image to it
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  //scaling gameOver and restart
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  //making the gameOver,restart,ground invisible
  gameOver.visible = false;
  restart.visible = false;
  ground.visible = false;
 
  //creating the obstacles group
  obstaclesGroup = new Group();
  //setting the value of score to be 0 initially
  score = 0;
}

 function draw() 
 {
  //setting the background
  background(groundImage);
  //displaying the text for Score
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);
  //showing *Press space key to jump text
  textSize(30)
  fill("red")
  text('Press Space Key to jump!!',30,80)
    
  //if condition for gameState = Play
  if (gameState === PLAY)
  {
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    //if condition for making the girl jump by pressing space key 
    if((touches.length > 0 || keyDown("SPACE")) && girl.y  >= height-120) 
    {
      //playing the jumpsound 
      jumpSound.play();
      //setting the girl's velocity 
      girl.velocityY = -15;
      touches = [];
    }
    //increasing the girl's velocity while jumping
    girl.velocityY = girl.velocityY + 0.8
  
    //reseting the ground
    if (ground.x < 0)
    {
      ground.x = ground.width/2;
    }
    //making the girl collide with ground
    girl.collide(ground);
    //calling the function spawnObstacles
    spawnObstacles();
  
    //if condition for collision with girl and obstacles
    if(obstaclesGroup.isTouching(girl))
    {
      //playing the collided sound
      collidedSound.play();
      //changing the gameState to end
      gameState = END;
    }
  }
  //changing the gameState to end if girl collide with obstacles
  else if (gameState === END) 
  {
    //text for telling the player to restart the game if enter key is pressed
    fill("green");
    text("*Press Enter to restart the game!!!",width/2-200,height/2-80);

    //making gameOver and restart visible
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    girl.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
      
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
      
    //reseting the game if enter key is pressed
    if(touches.length>0 || keyDown("ENTER")) 
    {      
      reset();
      touches = []
    }
  }
  
  drawSprites();
}

 function spawnObstacles() 
 {
  //making the obstacle appear after every 60 frame count
  if(frameCount % 60 === 0) 
  {
    //creating the obstacle sprite
    var obstacle = createSprite(600,height-95,20,30);
    //setting the collider for the obstacle
    obstacle.setCollider('circle',0,0,45);
    //setting the velocity to the obstacle
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) 
    {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      default: break;
    }
    
    //assigning scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = girl.depth;
    girl.depth +=1;
    //adding each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
 }

 function reset()
 {
  //changing the gameState to play if the game is restarted
  gameState = PLAY;
  //making the game over and restart invisible
  gameOver.visible = false;
  restart.visible = false;
  //destroying the obstacles so that the older ones are not visible
  obstaclesGroup.destroyEach();
  //changing the score to be 0
  score = 0;
 }
