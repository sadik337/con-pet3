var dog,happyDog,database,foodS,foodStock,dogImg,feedTime,lastFed,foodObj;
var gameState=0;
var readState;
var bedroom,washroom,garden,sadDog;

function preload(){
	dogImg=loadImage("dog1.png");
  happyDog=loadImage("dog2.png");
  bedroom=loadImage("BedRoom.png");
  garden=loadImage("Garden.png");
  washroom=loadImage("WashRoom.png");
  sadDog=loadImage("sadDog.png")
}

function setup() {
	
  database = firebase.database();
  createCanvas(1000,500);

  foodObj= new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
   
  dog=createSprite(830,180,50,20);
  dog.addImage(dogImg);
  dog.scale=0.2
  
  feed=createButton("feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  }


function draw() {  
   background("green");
  
   foodObj.display();
  
  fedTime=database.ref('feedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  })
  
  readState=database.ref('gameState');
  readState.on("value",function (data){
   gameState=data.val();
  })

  

  
   fill(225225,254);
   textSize(15);
   if(lastFed>=12){
     text("last Feed :"+lastFed%12 + "pm",350,30);
   }else if(lastFed==0){
     text("last Feed : 12 AM",350,30);
   }else{
     text("last Feed : "+ lastFed + "AM",350,30);
   }


   currentTime=hour();
if(currentTime==(lastFed+1)){
update("Playing");
foodObj.garden();
}else if(currentTime==(lastFed+2)){
update("Sleeping");
foodObj. bedroom();
}else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
update("Bathing");
foodObj.washroom();
}else{
update("Hungry")
foodObj.display();
}


   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
     feed.show();
     addFood.show();
     dog.addImage(sadDog);
   }
 
  drawSprites();

}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  if(foodObj.getFoodStock()<= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }

  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
     gameState:state
  });
}
