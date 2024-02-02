"use strict"
let H, W, san, {hypot, atan2, sin, cos, random, PI} = Math, boids = [];

class Boid {
    constructor(x, y) {
        this.x = random() * W;
        this.y = random() * H;
        this.vx = random() * 4 - 2;
        this.vy = random() * 4 - 2;   
        this.dx=0;
        this.dy=0;
        this.a;
    }
    draw() {
        this.update();
        let A  =this.a;
        let a = PI / 180 * 90;
        san.fillStyle = "cyan";
        san.beginPath();
        san.moveTo(this.x + cos(A) * 10, this.y + sin(A) * 10);        
        san.lineTo(this.x + cos(A - a) * 8, this.y + sin(A - a) * 8);
        san.lineTo(this.x + cos(A + a) * 8, this.y + sin(A + a) * 8);
        san.lineTo(this.x + cos(A) * 10, this.y + sin(A) * 10);
        san.lineTo(this.x + cos(A) * -10, this.y + sin(A) * -10);
        san.closePath();
        san.fill();
        san.stroke();
    }
    update() {
        this.rules();
        this.x += this.vx + this.dx;
        this.y += this.vy + this.dy;
        this.a = atan2(this.vy + this.dy, this.vx + this.dx);
        if(this.x > W) this.x = 0;
        if(this.x < 0) this.x = W;
        if(this.y > H) this.y = 0;
        if(this.y < 0) this.y = H;
        this.dx = 0;
        this.dy = 0;
    }
    rules() {
        let nearByBoids = [];
        let steer = {x:0, y:0};
        let steer2 = {x:0, y:0};
        for(let boid of boids) 
            if(this != boid && hypot(boid.x - this.x, boid.y - this.y) < 250) 
                nearByBoids.push(boid);
        nearByBoids.forEach(boid => {
            steer.x += boid.vx;
            steer.y += boid.vy;
            steer2.x += boid.x;
            steer2.y += boid.y;
        })
        steer.x /= nearByBoids.length;
        steer.y /= nearByBoids.length;
        let mag = hypot(steer.x, steer.y)
        steer.x /= mag;
        steer.y /= mag;  
        steer2.x /= nearByBoids.length;
        steer2.y /= nearByBoids.length;
        steer2.x -= this.x;
        steer2.y -= this.y;
        let mag2 = hypot(steer2.x, steer2.y)
        steer2.x /= mag2;
        steer2.y /= mag2; 
        if(nearByBoids.length > 0) {
            this.dx += steer.x * 2;
            this.dy += steer.y * 2; 
            this.dx += steer2.x * 2;
            this.dy += steer2.y * 2;
        } 
        let nearByBoids2 = [];
        let steer3 = {x:0, y:0};
        for(let boid of boids) if(this != boid && hypot(boid.x - this.x, boid.y - this.y) < 30) 
            nearByBoids2.push(boid);
        nearByBoids2.forEach(boid => {
            steer3.x += boid.x;
            steer3.y += boid.y;
        })
        steer3.x /= nearByBoids2.length;
        steer3.y /= nearByBoids2.length;
        steer3.x -= this.x;
        steer3.y -= this.y;
        let mag3 = hypot(steer3.x, steer3.y);
        steer3.x /= mag3;
        steer3.y /= mag3; 
        if(nearByBoids2.length > 0) {
            this.dx -= steer3.x * 3;
            this.dy -= steer3.y * 3; 
        }               
    }
}

const Loop = () => {
    san.clearRect(0, 0, W, H);
    san.fillStyle="rgba(0,0,0,.35)"  
    san.fillRect(0,0,W,H);
    boids.forEach(v => v.draw() );
    webkitRequestAnimationFrame(Loop);
}

const init = () => {
    document.body.style.margin = 0;
    let c = document.createElement("canvas");
    document.body.appendChild(c);
    c.style.position = "fixed";
    c.style.background = "black";
    c.style.width = "100vw";
    c.style.height = "100vh";
    c.height = H = innerHeight*2;
    c.width = W = innerWidth*2;
    san = c.getContext('2d');  
    for(var i = 0; i < 100; i++) boids.push(new Boid(W / 2, H / 2));
    Loop();
};

onload = init;
