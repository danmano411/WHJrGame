var player, dartGroup, spikeGroup, coinGroup;
var ground;
var treasure, boss;
var fireGroup;
const PLAY = 1;
const END = 2;
const START = 0;
const WIN = 3;
var gameState = START;
var score = 0;
var playerIMG, bossIMG, coinIMG, dartIMG, spikeIMG, fireballIMG, groundIMG, treasureIMG;

function preload(){
  playerIMG = loadImage("images/Treasure_Man.png")
  bossIMG = loadImage("images/Boss.png")
  coinIMG = loadImage("images/Coin.png")
  dartIMG = loadImage("images/Dart.png")
  spikeIMG = loadImage("images/Spike.png")
  fireballIMG = loadImage("images/Fireball.png")
  groundIMG = loadImage("images/Ground.png")
  treasureIMG = loadImage("images/Treasure.png")
  restartIMG = loadImage("images/Restart.png")

  jumpSound = loadSound("Jump.mp3")
  coinSound = loadSound("Coin.mp3")
  loseSound = loadSound("Crash.mp3")
  treasureSound = loadSound("Treasure.mp3")
}

function setup() {
  createCanvas(800,400);
 
  player = createSprite(100, 350, 50, 50);
  player.addImage(playerIMG)
  player.shapeColor = "green";
  player.scale = 0.55
  player.setCollider("rectangle", 0, 0, 110, 170)

  ground = createSprite(800, 400, 1600, 10)
  ground.velocityX = -10
  ground.shapeColor = "brown"
  ground.addImage(groundIMG)
  ground.scale = 1600/549
  ground.setCollider("rectangle", 0, 15, 1600, 50)

  boss = createSprite(900, 200, 100, 100);  

  restart = createSprite(400, 320, 20, 20)
  restart.addImage(restartIMG);
  restart.visible = false;
  restart.scale = 0.5

  spikeGroup = new Group;
  dartGroup = new Group;
  coinGroup = new Group;
  fireGroup = new Group;
}

function draw() {
  if(gameState === START){
    background(0)
    textSize(32)
    fill("white")
    text("Collect the yellow coins for points", 180, 100)
    text("The red and white are bad", 220, 160)
    text("Try to collect the treasure", 230, 220)
    text("Press space to start", 260, 280)

    if(keyDown("space")){
      gameState = PLAY
      resetFramcount();
    }
  }

  if (gameState === PLAY){
    background("blue");

    restart.visible = false;
    player.visible = true;
    if(frameCount === 0){
      player.x = 100;
      player.y = 350;
    }
    ground.visible = true;
    coinGroup.visible = true;
    dartGroup.visible = true;
    spikeGroup.visible = true;
    boss.visible = true;
    fireGroup.visible = true;

    drawSprites(); 
    player.collide(ground)
    player.depth += 1;

    player.velocityY += 0.6;

    if(ground.x < 0){
      ground.x = 800;
    }

    if(player.isTouching(spikeGroup) || player.isTouching(dartGroup)){
      gameState = END;
      loseSound.play();
    }

    if (player.isTouching(coinGroup)){
      coinGroup.destroyEach()
      score+=10;
      coinSound.play();
    }

    if (frameCount < 2000){
      makeSpikes();
      makeDarts();
    }
    makeCoins();
    console.log(player.y)

    fill("white")
    text("Score: " + score, 10, 20)

    if (frameCount > 2000 && frameCount < 2500){      
      boss.x = 700
      boss.shapeColor = "red"
      boss.addImage(bossIMG)
      makeFireBall();

      if(player.isTouching(fireGroup)){
        gameState = END;
        loseSound.play();
      }
      
    }

    if(frameCount < 2500){
      if(((keyWentDown(UP_ARROW) || keyWentDown("space"))) && player.y === 324.106102003643 ){
        player.velocityY = -10;
        jumpSound.play();
      }
    }

    if (frameCount > 2500){
      boss.x = 900;
      treasure = createSprite(810, 50, 100, 50);
      treasure.shapeColor = "yellow"
      treasure.x = 100;
      treasure.addImage(treasureIMG)
      treasure.scale = 0.4

      fill("white")
      text("(Triple Jump)", 70, 200)

      if(player.isTouching(treasure)){
        gameState = WIN;
        treasureSound.play()
      }

      if(keyWentDown(UP_ARROW) || keyWentDown("space")){
        player.velocityY = -10;
        jumpSound.play()
      }
    }
  }

  if(gameState === END){
    background(0)
    textSize(32)
    push();
    fill("red")
    text("Oops you crashed. Try again!", 200, 200)
    fill("white")
    text("Your score was: " + score, 280, 250)
    pop();

    restart.visible = true;
    player.visible = false;
    ground.visible = false;
    coinGroup.destroyEach();
    dartGroup.destroyEach();
    spikeGroup.destroyEach();
    boss.visible = false;
    fireGroup.destroyEach();

    drawSprites();



    if(mousePressedOver(restart)){
      gameState = START;
      score = 0;
    }
  }

  if(gameState === WIN){
    background(0)
    textSize(32)
    fill("green")
    text("You Win!", 350, 200)
    fill("white")
    text("Your score was: " + score, 300, 250)
  }
 
}

function makeSpikes(){
  if (frameCount%80 === 0){
    var spike = createSprite(810, 330, 20, 20)
    spike.velocityX = -10;
    spike.lifetime = 800/10;
    spike.shapeColor = "white"
    spike.addImage(spikeIMG)
    spike.scale = 0.26
    spike.setCollider("rectangle", 0, 0, 180, 210)

    spikeGroup.add(spike);
  }
}

function makeDarts(){
  if (frameCount > 1000){
    if (frameCount%100 === 0){
      var dart = createSprite(810, random(0, 180), 40, 10)
      dart.shapeColor = "red"
      dart.velocityX = -8;
      dart.lifetime = 800/8;
      dart.addImage(dartIMG)
      dart.scale = 0.4
      dart.setCollider("rectangle", 0, 0, 200, 100)


      dartGroup.add(dart);
    }
  }
}

function makeCoins(){
  if(frameCount < 2500){
    if(frameCount%60 === 0){
      var coin = createSprite(810, random(200, 280), 10, 10)
      coin.shapeColor = "yellow";
      coin.addImage(coinIMG)
      coin.scale = 0.2
      coin.velocityX = -15;
      coin.lifetime = 800/15

      coinGroup.add(coin)
    }
  }
}

function resetFramcount(){
  frameCount = 0;
}

function makeFireBall(){
  if(frameCount%90 === 0){
    var rand = Math.round(random(1, 2))
    var fireBall = createSprite(750, 0, 30, 30)
    if (rand === 1){
      fireBall.y = random(200, 180);
    }
    if (rand === 2){
      fireBall.y = 330;
    }
    fireBall.shapeColor = "orange"
    fireBall.velocityX = -16;
    fireBall.lifetime = 750/18;
    fireBall.addImage(fireballIMG)
    fireBall.scale = 0.3

    fireGroup.add(fireBall)
  }
}