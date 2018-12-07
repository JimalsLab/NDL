var p = new p5();
var p5v = p5.Vector;
var stopStars = false;

class Sketch {
	constructor() {
		// string constants
		this.stringDots = new Array();
        this.font = '/assets/fonts/POLYA.otf';
		this.dotSize = 2;
		this.sampleFactor = 0.05;
        this.textRatio = 0.8;
        
		// stars constants
		this.starsCount = 200;
		this.stars = [];
		
	}
	
    preload() {
        loadFont('/assets/fonts/POLYA.otf');
	}
    setup() {
		for (var i = 0; i < 200; i++) {
			this.stars[i] = new Star();
		}
	}
	
	
	draw() {
        p.background(51);

        if (frameCount > 250) {
            document.getElementById('divToHide').setAttribute('style', 'height:100%; min-height:100%; max-height:100%; display: block');
            remove();
            return;
        }
        if (frameCount == 70) {
            stopStars = true;
            var text = "PitBuddy";
            this.setupBoidsForWord(text, true);
        }
		// loop through text dots
		if(stopStars)
			for (let v of this.stringDots) {
				v.behaviors();
				v.update();
				v.show();
			}
		
		// loop through stars dots
		translate(width / 2, height / 2);
		for (var i = 0; i < this.stars.length; i++) {
			this.stars[i].update();
			this.stars[i].show();
		}
		
	}
	
	// set coords of points from the font and the text
	setupBoidsForWord(str, forceRedraw = false) {
		if (trim(str) != "" && (str != this.text || forceRedraw)) {
            this.text = str;
            try {
                p.loadFont(this.font, (f) => {

                    let fontSize = this.getFontSizeTextInBounds(f, str, p.width * this.textRatio, p.height * this.textRatio);
                    var bbox = f.textBounds(str, 0, 0, fontSize);
                    let x = p.width * (1 - this.textRatio) * 0.5;
                    let y = (p.height / 2) + (bbox.h / 2);
                    let points = f.textToPoints(str, x, y, fontSize, { sampleFactor: this.sampleFactor });
                    this.migrateToNewPoints(points);
                });
            } catch (error) {
                console.error(error);
	            
            }
		}
	}
	
	getFontSizeTextInBounds(font, text, boundsWidth, boundsHeight) {
		let fontSize = 1;
		let bbox = { w: 0, h: 0 };
		while (bbox.w < boundsWidth && bbox.h < boundsHeight) {
			fontSize += 2;
			bbox = font.textBounds(text, 0, 0, fontSize);
		}
		return fontSize;
	}
	
	migrateToNewPoints(points) {
		if (this.stringDots.length == 0) {
			for (let point of points) {
				let target = p.createVector(point.x, point.y);
				
				// init position to a random corner
				// let position = p.createVector(p.round(p.random(0,1))*p.width, p.round(p.random(0,1))*p.height);	//	p.createVector(p.random(0, p.width), p.random(0, p.height));
				
				// init position to the center
				let position = p.createVector(p.width*0.5, p.height*0.5);
				
				let acceleration = p.createVector();
				let velocity = p5.Vector.random2D();
				let v = new StringDot(this.dotSize, target, position, acceleration, velocity);
				this.stringDots.push(v);
			}
		}
		else {
			var currentCount = this.stringDots.length;
			var difference = points.length - currentCount;
			if (difference > 0) {
				for (var i = 0; i < difference; i++) {
					let randomIndex = Math.floor((Math.random() * this.stringDots.length));
					let v = this.stringDots[randomIndex].copy();
					this.stringDots.splice(randomIndex, 0, v);
				}
			}
			else if (difference < 0) {
				for (var i = 0; i < difference * -1; i++) {
					let randomIndex = Math.floor((Math.random() * this.stringDots.length));
					this.stringDots.splice(randomIndex, 1);
				}
			}
		}
		
		for (var i = 0; i < points.length; i++) {
			var point = points[i];
			var v = this.stringDots[i];
			v.setTarget(new p5.Vector(point.x, point.y));
			v.setSize(this.dotSize);
		}
	}
}