const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope,fruit,ground,ground2;
var fruit_con;
var fruit_con_2;
var rope, rope2;

var bg_img;
var food;
var rabbit;

var button,button2;
var bunny;
var bubble, bubbleImg;
var blink,eat,sad;

var cut_sound;
var sad_sound;
var eating_sound;

function preload() {
  bg_img = loadImage('assets/background.png');
  food = loadImage('assets/melon.png');
  rabbit = loadImage('assets/Rabbit-01.png');
  bubbleImg = loadImage("assets/bubble.png");

  sad_sound = loadSound("assets/sad.wav")
  cut_sound = loadSound('assets/rope_cut.mp3');
  eating_sound = loadSound('assets/eating_sound.mp3');

  blink = loadAnimation("assets/blink_1.png","assets/blink_2.png","assets/blink_3.png");
  eat = loadAnimation("assets/eat_0.png" , "assets/eat_1.png","assets/eat_2.png","assets/eat_3.png","assets/eat_4.png");
  sad = loadAnimation("assets/sad_1.png","assets/sad_2.png","assets/sad_3.png");

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping= false;
  eat.looping = false; 
}

function setup() {
  createCanvas(600,windowHeight);
  frameRate(80);

  engine = Engine.create();
  world = engine.world;

  rope = new Rope(4,{x:30,y:380});
  rope2 = new Rope(6,{x:250,y:260});

  ground = new Ground(300,height,width,20);
  ground2 = new Ground(350,180,100,13);


  blink.frameDelay = 20;
  eat.frameDelay = 20;

  bunny = createSprite(320,108,100,100);
  bunny.scale = 0.2;

  bunny.addAnimation('blinking',blink);
  bunny.addAnimation('eating',eat);
  bunny.addAnimation('crying',sad);
  bunny.changeAnimation('blinking');

  button = createImg('assets/cut_btn.png');
  button.position(10,380);
  button.size(50,50);
  button.mouseClicked(drop);

  button2 = createImg('assets/cut_btn.png');
  button2.position(230,260);
  button2.size(50,50);
  button2.mouseClicked(drop2);

  bubble = createSprite(340,380);
  bubble.addImage(bubbleImg);
  bubble.scale = 0.1;
  bubble.visible = true;

  fruit = Bodies.circle(160,400,20);
  Matter.Composite.add(rope.body,fruit);

  fruit_con = new Link(rope,fruit);
  fruit_con_2 = new Link(rope2,fruit);
  
  rectMode(CENTER);
  ellipseMode(RADIUS);
}

function draw() {
  background(51); 
  image(bg_img,0,0,width,height);

  push();
  imageMode(CENTER);
  if(fruit!=null){
    image(food,fruit.position.x,fruit.position.y,70,70);
  }
  pop();

  rope.show();
  rope2.show();
  ground.show();
  ground2.show();

  Engine.update(engine); 

  drawSprites();

  if(collide(fruit,bunny, 80)==true)
  {
    bubble.visible = false;
    World.remove(engine.world,fruit);
    fruit = null;
    bunny.changeAnimation('eating');
    eating_sound.play();
  }

  if(fruit!=null && fruit.position.y>=650)
  {
    bunny.changeAnimation('crying');
    sad_sound.play();
    fruit=null;
  }

  if(collide(fruit,bubble, 80)==true) {
    Matter.Body.applyForce(fruit, { x: 0, y: 0}, { x: 0, y: -0.03});
  }
}

function collide(body,sprite, x)
{
  if(body!=null) {
    var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
    if(d<=x) {
     return true; 
    } else{
      return false;
    }
  }
}

function drop()
{
  cut_sound.play();
  rope.break();
  fruit_con.dettach();
  fruit_con = null; 
}

function drop2()
{
  cut_sound.play();
  rope2.break();
  fruit_con_2.dettach();
  fruit_con_2 = null;
}