let particleDataObjects = document.querySelectorAll(`[data-is-particle="true"]`);

let particles = [];
let particleBeingFocused = false;

let currentDB;
changeDB = (channelName) => {
    localStorage.setItem('changeDB', channelName);
}

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
                particle.dataset['fbKey'], // firebase key
                particle.dataset['claimed'] === 'true', // claimed
                particle.dataset['nickname'] // nickname
            )
        )
    });
}

function draw(){
    background(0, 150);
    particles.forEach((particle) => {
        particle.drawShape();
        particle.move();
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

        this.inDancingState = true;

        this.claimed = claimed;
        this.name = nickname;
        this.password = "";
        this.firebaseKey = firebaseKey;

        // html elements
        this.button = createButton("submit");
        this.input = createInput().attribute('placeholder','name');
        this.pass = createInput().attribute('placeholder','password');
        this.esc = createButton("esc");
        this.button.hide();
        this.input.hide();
        this.pass.hide();
        this.esc.hide();

        // element click handlers
        this.setUpEscapeButtonClickHandler()
        this.setUpSubmitButtonClickHandler()
    }

    setUpEscapeButtonClickHandler() {
        this.esc.mousePressed(() => {
            // no particle being focused
            particleBeingFocused = false;

            // hide html elements
            this.esc.hide();
            this.button.hide();
            this.input.hide();
            this.pass.hide();
            this.speedX = random(5,10);
            this.speedY = random(5,10);
        })
    }

    setUpSubmitButtonClickHandler() {
        this.button.mousePressed(() => {
            this.name = this.input.value();
            this.password = this.pass.value();
            if(this.name.length > 0 && this.password.length > 0){
                // claim particle
                this.claimed = true;

                // reset speed
                this.speedX = random(5, 10);
                this.speedY = random(5, 10);

                // hide html elements
                this.button.remove();
                this.input.remove();
                this.pass.remove();
                this.esc.hide();
                particleBeingFocused = false;

                // defined in PostClaimParticle.js
                
                currentDB = localStorage.getItem('changeDB');
                postClaimedParticle(
                    this.firebaseKey,
                    this.password,
                    this.name,
                    currentDB,
                );
            }
        });
    }

    drawName() {
        fill(255);
        stroke(0);
        textAlign(CENTER);
        text(this.name, this.centerX, this.centerY - this.size/2);
    }

    drawShape() {
        fill(this.color1, this.color2 ,this.color3);
        noStroke();
        ellipse(this.centerX,this.centerY,this.size);
        if(this.claimed){
            this.drawName();
        }
    }

    isClicked() {
        return (mouseX > this.centerX - this.size/2 && mouseX < this.centerX + this.size/2)
            && (mouseY > this.centerY - this.size/2 && mouseY < this.centerY + this.size/2)
            && mouseIsPressed
            && !particleBeingFocused;
    }

    showEscapeButton() {
        this.esc.show();
        this.esc.position(this.centerX - this.size, this.centerY - this.size*2);
    }

    showNickNameInput() {
        this.input.show();
        this.input.position(this.centerX, this.centerY + this.size);
    }
    
    showPasswordInput() {
        this.pass.show();
        this.pass.position(this.centerX, this.centerY + this.size + 25);
    }

    showSubmitButton() {
        this.button.show();
        this.button.position(this.centerX, this.centerY + this.size + 50);
    }

    checkClick() {
        if (this.isClicked()){
            // particle being focused is the current particle
            particleBeingFocused = true;

            // stop the particle from moving
            this.speedX = 0;
            this.speedY = 0;

            this.showEscapeButton();

            if(!this.claimed){
                this.showNickNameInput();
                this.showPasswordInput();
                this.showSubmitButton();
            }
        }
    }

    updateParticleCenter() {
        if(this.inDancingState){
            // particle moves erratically
            this.centerX += random(-this.speedX,this.speedX);
            this.centerY += random(-this.speedY,this.speedY);
        } else {
            // particle bounces smoothly arount
            this.centerX += this.speedX;
            this.centerY += this.speedY;
        }
    }

    isCollidingWithAnyParticle() {
        // short circuit if already dancing with
        if (!this.inDancingState) {
            for(let j = 0; j < particles.length; j++){
                let dis = dist(this.centerX, this.centerY, particles[j].centerX, particles[j].centerY);
                if(dis > 0 && dis < this.size/2 + particles[j].size/2){
                    return true;
                }
            }
        }
        return false;
    }

    handleBoundaryChecks() {
        if (this.centerY > window.innerHeight - 50) {
            this.inDancingState = false;
            this.speedY = -this.originalSpeed;
        }

        if (this.centerY < 50) {
            this.inDancingState = false;
            this.speedY = this.originalSpeed;
        }

        if (this.centerX > window.innerWidth - 50) {
            this.inDancingState = false;
            this.speedX = -this.originalSpeed;
        }

        if (this.centerX < 50) {
            this.inDancingState = false;
            this.speedX = this.originalSpeed;
        }
    }

    move(){
        // move center based on two different states it can be in
        this.updateParticleCenter();

        // when two particles collide they begin dancing
        if (this.isCollidingWithAnyParticle()) {
            this.inDancingState = true;
        }

        // allow particles to stay in bounds and update state if touching walls
        this.handleBoundaryChecks();
    }
}