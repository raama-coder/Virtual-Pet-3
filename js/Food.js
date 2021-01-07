class Milk{

    constructor(){
        this.foodStock=0;

this.image=loadImage("images/Milk.png");
}

display(){
    var x = 80
    var y = 100

    imageMode(CENTER);

if(this.foodStock>0){
    for(var i=0; i<this.foodStock; i++){
        if(i%10==0){
            x=80
            y+=50
           } 
           image(this.image, x, y, 50, 50);
           x+=30
        }
    }
}

   

    updateFood(){
        dataBase.ref("/").update({
            Food:this.foodStock
        })
    }

    bedroom(){
        background(bedroom, 500, 300)
    }

    garden(){
        background(garden, 500, 300)
    }

    washroom(){
        background(washroom, 500, 300)
    }
}