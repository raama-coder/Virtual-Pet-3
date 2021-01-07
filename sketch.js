var dog, dogImg, happyDog, sadDog
var dataBase
var foodS, foodStock
var feedDogButton=false;
var addFoodButton=false;
var add, feed
var fedTime, lastFed
var milk
var readGS, chanGS
var bedroom, garden, washroom
var gameState = 0;
var Hungry=0, Happy=1,Playing=2, Sleeping=3, Bathing=4 ;
var currHour=new Date().getHours()
var textMsg =""

function preload(){
  dogImg = loadImage("images/Dog.png")
  happyDog = loadImage("images/happydog.png")
  bedroom = loadImage("images/Bedroom.png")
  garden = loadImage("images/Garden.png")
  washroom = loadImage("images/Washroom.png")
  sadDog = loadImage("images/deadDog.png")
}

function setup() {
    createCanvas(1000, 600);
    dog = createSprite(750,380,150,50);
    dog.addImage(dogImg);
    dog.scale = 0.23;
    
    milk = new Milk()

    dataBase=firebase.database();

    foodStock = dataBase.ref("Food");
    foodStock.on("value", getFoodStock);
    
    readGS = dataBase.ref("gameState")
    readGS.on("value", function(data){
      readGS=data.val();
    });
    if (readGS==="hungry")
      gameState=Hungry
    else if (readGS==="happy")
      gameState=Happy
    else if (readGS==="playing")
      gameState=Playing
    else if (readGS==="bathing")
      gameState=Bathing
    else if (readGS==="sleeping")
      gameState=Sleeping
 
 
    feed= createButton("FEED DOG");
    feed.position(853, 150);
    feed.mousePressed(feedDog);

    add = createButton("ADD FOOD");
    add.position(550, 150);
    add.mousePressed(addFood);
}

function draw() {
  background(62, 149, 101)

  drawSprites();

  if(gameState!=Hungry){
    add.hide();
    feed.hide();
  }else{
    
    add.show();
    feed.show();
    dog.addImage(sadDog)
  }
  var intravel=Math.abs(currHour-fedTime)
  console.log(intravel)
  if (intravel>=0&&intravel<1){
      gameState=Happy
      update("happy")
      dog.addImage(happyDog);
      textMsg="Drago was fed and is feeling happy!"
    }
  else if(intravel>=1&&intravel<2){
    milk.garden()
    gameState=Playing
    update("playing")
    textMsg="Drago is Playing in my garden !!!"
    }
  else if(intravel>=2&&intravel<3){
      milk.bedroom()
      gameState=Sleeping
      update("sleeping")
      textMsg="Shh.. Drago is sleeping !!!"
    }
    else if(intravel=3&&intravel<4){
      milk.washroom()
      gameState=Bathing
      update("bathing")
      textMsg="Drago enjoys to take hot shower !!!"
    }
    else {
      console.log("in last else if")
      gameState=Hungry
      update("hungry")
      textMsg="Drago is hungry, please feed him"
      milk.display()
    }
    
  
  
  textSize(36)
  strokeWeight(2);
  fill("gold")
  text(textMsg, 40,50);

  showTime()

  
}

function getFoodStock(data){
  foodS=data.val();
  milk.foodStock=foodS;
}

function addFood(){
  milk.foodStock+=1
  milk.updateFood();

}

function deductFood(){
  milk.foodStock-=1
  milk.updateFood();
}

function feedDog(){
  lastFed = dataBase.ref("LastFed");
  lastFed.on("value",function(data){
    fedTime=data.val()
  })
  var currHour=new Date().getHours();
  if (Math.abs(currHour-fedTime)>=1){
    deductFood();
    dataBase.ref('/').update({
      LastFed: currHour
    })
  }
  gameState=Happy
    update("happy")
  
}

function showTime(){
lastFed = dataBase.ref("LastFed");
lastFed.on("value",function(data){
  fedTime=data.val()
})

  fill("white")
  textSize(25)
  if(fedTime>=12){
    text("Last Fed Time: "+ fedTime%12 + " PM", 650, 50)
  }else if(fedTime==0){
    text("Last Fed Time: 12 AM", 600, 60)
  }else{
    text("Last Fed Time: "+ fedTime + " AM", 650, 50)
  }
}

function update(state){
  dataBase.ref("/").update({
    gameState:state
  })
}