let particleDataObjects = document.querySelectorAll(`[data-is-particle="true"]`);

let particles = [];
let focused = false;

let NUM_PARTICLES = 15;
function setup() {
    frameRate(30);
    createCanvas(window.innerWidth, window.innerHeight);
    background(0);

    particleDataObjects.forEach((particle) => {
        particles.push(
            new Particle(
                random(60,window.innerWidth - 60), // centerX
                random(60,window.innerHeight - 60), // centerY
                random(15,35), // size
                random(5,10), // speed
                random(0,255), // color1
                random(0,255), // color2
                random(0,255), // color3
                particle.dataset['fbKey'],
                particle.dataset['claimed'] === 'true',
                particle.dataset['nickname']
            )
        )
    });
}

function draw(){
    background(0, 150);
    particles.forEach((particle) => {
        particle.drawShape();
        particle.defaultMove();
        particle.checkClick();
    });
}

class Particle{
    constructor(
        centerX,
        centerY,
        size,
        speed,
        color1,
        color2,
        color3,
        firebaseKey,
        claimed,
        nickname
    ){
        this.centerX = centerX;
        this.centerY = centerY;
        this.size = size;

        this.color1 = color1;
        this.color2 = color2;
        this.color3 = color3;
        
        this.originalSpeed = speed;
        this.speedX = speed;
        this.speedY = speed;

        this.boundary = false;

        this.esc;
        // html elements
        this.button = createButton("submit");
        this.input = createInput().attribute('placeholder','name');
        this.pass = createInput().attribute('placeholder','password');
        this.esc = createButton("esc");
        this.claimed = claimed;

        // user submitted
        this.name = nickname;
        this.password = "";
        this.firebaseKey = firebaseKey;
    }

    drawShape(){
        fill(this.color1, this.color2 ,this.color3);
        noStroke();
        ellipse(this.centerX,this.centerY,this.size);
        if(this.claimed){
            fill(255);
            stroke(0);
            textAlign(CENTER);
            text(this.name, this.centerX, this.centerY - this.size/2);
            text(this.password, this.centerX, this.centerY - this.size);
        }
    }

    checkClick(){
        if(mouseX > this.centerX - this.size/2 && mouseX < this.centerX + this.size/2){
            if(mouseY > this.centerY - this.size/2 && mouseY < this.centerY + this.size/2){
                if(mouseIsPressed && !focused){
                    //focus and leave focus
                    focused = true;
                    this.speedX = 0;
                    this.speedY = 0;
                    this.esc.show();
                    this.esc.position(this.centerX - this.size, this.centerY - this.size*2);
                    this.esc.mousePressed(() => {
                        focused = false;
                        this.esc.hide();
                        this.button.hide();
                        this.input.hide();
                        this.pass.hide();
                        this.speedX = random(5,10);
                        this.speedY = random(5,10);
                    })

                    //unclaimed
                    if(!this.claimed){
                        //name input
                        this.input.show();
                        this.input.position(this.centerX, this.centerY + this.size);
    
                        //pass input
                        this.pass.show();
                        this.pass.position(this.centerX, this.centerY + this.size + 25);

                        //submit
                        this.button.show();
                        this.button.position(this.centerX, this.centerY + this.size + 50);
                        //handle submit 
                        this.button.mousePressed(() => {
                            this.name = this.input.value();
                            this.password = this.pass.value();
                            if(this.name.length > 0 && this.password.length > 0){
                                this.claimParticle();
                                this.button.remove();
                                this.input.remove();
                                this.pass.remove();
                                this.esc.hide();
                                focused = false;
                            }
                        })
                        
                    //claimed
                    }else{
                        

                    }   
                }
            }
        }
    }

    claimParticle(){
        this.claimed = true;
        this.speedX = random(5,10);
        this.speedY = random(5,10);
    }

    defaultMove(){
        //movement
        if(!this.boundary){
            this.centerX += random(-this.speedX,this.speedX);
            this.centerY += random(-this.speedY,this.speedY);
        } else {
            this.centerX += this.speedX;
            this.centerY += this.speedY;
        }

        //collision check
        for(let j = 0; j < particles.length; j++){
            let dis = dist(this.centerX, this.centerY, particles[j].centerX, particles[j].centerY);
            if(dis > 0 && dis < this.size/2 + particles[j].size/2){
                this.boundary = false;
            }
        }

        //boundaries
        if (this.centerY > window.innerHeight - 50) {
            this.boundary = true;
            this.speedY = -this.originalSpeed;
        }

        if (this.centerY < 50) {
            this.boundary = true;
            this.speedY = this.originalSpeed;
        }

        if (this.centerX > window.innerWidth - 50) {
            this.boundary = true;
            this.speedX = -this.originalSpeed;
        }

        if (this.centerX < 50) {
            this.boundary = true;
            this.speedX = this.originalSpeed;
        }
        

    }
}