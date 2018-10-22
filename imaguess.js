class Button extends PIXI.Sprite {
    // https://medium.com/dailyjs/named-and-optional-arguments-in-javascript-using-es6-destructuring-292a683d5b4e
    constructor({
        x = 0,
        y = 0,
        color = 0xffffff,
        alpha = 1,
        txtValue = 'button',
        txtStyle = {},
        interactive = true,
        shape = {
            type: 'rect',
            options: {
                width: 100,
                height: 50
            }
        }
    } = {}) {
        super();
        this.x = x;
        this.y = y;
        this.color = color;
        this.alpha = alpha;
        this.txtValue = txtValue;
        this.txtStyle = txtStyle;
        this.interactive = interactive;
        this.shape = shape;
        this.unpressed = null;
				this.pressed = null;
        this.pressed2 = null;
        this.text = null;
        
        this.generate();
    }

    generate() {
        var gfx = new PIXI.Graphics();
        this.text = new PIXI.Text();

        const rectButton = () => {
            const {width, height}  = {...this.shape.options};
            
            gfx.endFill();
            gfx.lineStyle(3, this.color, 1);
            gfx.drawRect(5, 5, width, height);
            gfx.beginFill(this.color);
            
            gfx.lineStyle(0, 0xFF3300, 0);
            gfx.drawRect(0, 0, width, height);
            this.text.x = width / 2;
            this.text.y = height / 2;
            gfx.endFill();
        };

				const pressedButton = () => {
            const {width, height}  = {...this.shape.options};
            
            gfx.endFill();
            
            gfx.lineStyle(1, 0xff0000, 0);
            gfx.moveTo(0, 0);
						gfx.lineTo(10, 0);

            gfx.lineStyle(3, this.color, 1);
            gfx.drawRect(5, 4, width, height);
            gfx.beginFill(this.color);
            
            gfx.lineStyle(0, 0xFF3300, 0);
            gfx.drawRect(2, 1, width, height);
            this.text.x = width / 2;
            this.text.y = height / 2;
            gfx.endFill();
        };
        
         const pressedButton2 = () => {
            const {width, height}  = {...this.shape.options};
            
            gfx.endFill();
            
            gfx.lineStyle(1, 0xff0000, 0);
            gfx.moveTo(0, 0);
						gfx.lineTo(10, 0);

						gfx.beginFill(this.color, 0.6);
            gfx.lineStyle(3, this.color, 1);
            gfx.drawRect(5, 5, width, height);
            this.text.x = width / 2;
            this.text.y = height / 2;
            gfx.endFill();
        };

        //this.removeChildren();

        this.text.anchor = new PIXI.Point(0.5, 0.5);
        this.text.text = this.txtValue;
        this.text.style = this.txtStyle;

        gfx.beginFill(this.color, this.alpha);
        rectButton();
        gfx.endFill();
        this.unpressed = gfx.generateCanvasTexture();
        this.texture = gfx.generateCanvasTexture();

				gfx = new PIXI.Graphics();

        gfx.beginFill(this.color, this.alpha);
        pressedButton();
        gfx.endFill();
        this.pressed = gfx.generateCanvasTexture();
        
        gfx = new PIXI.Graphics();
        gfx.beginFill(this.color, 50);
        pressedButton2();
        gfx.endFill();
        this.pressed2 = gfx.generateCanvasTexture();
        
        this.addChild(this.text);
    }
}

var stageDiv = document.getElementById('stage');
var renderer = PIXI.autoDetectRenderer(653, 679, stageDiv, {antialias: false, backgroundColor: 0xDD0000});
var stage = new PIXI.Container();
stageDiv.appendChild(renderer.view);

PIXI.settings.RESOLUTION = 3;
PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

var container = new PIXI.Container();
stage.addChild(container);
AddButton('mucho', 100, 100);
AddButton('muchosos', 100, 160);
AddButton('muchosos', 100, 220);
AddButton('muchosos', 100, 300);

var ticker = new PIXI.ticker.Ticker();

ticker.add(function (deltaTime) {
    renderer.render(stage);
});

ticker.start();

function AddButton(text, x, y){
	 const button = new Button({
                x: x,
                y: y,
                color: 0x406868,
                txtValue: text,
                // http://pixijs.download/release/docs/PIXI.Text.html#style
                txtStyle: new PIXI.TextStyle({
                    fontFamily:"Boo City",
                    align: 'center',
                    fill: '#AD976B',
                    fontSize: 20
                }),
                shape: {
                    type: 'rect',
                    options: {
                        width: 200,
                        height: 50
                    }
                }
            });
            container.addChild(button);

	button.on('mouseover', (e) => {;
  		e.currentTarget.text.x += 2;
      e.currentTarget.text.y += 2;
			e.currentTarget.texture = e.currentTarget.pressed;
  });
     
  button.on('mouseout', (e) => {
  		e.currentTarget.text.x -= 2;
  		e.currentTarget.text.y -= 2;
			e.currentTarget.texture = e.currentTarget.unpressed;
  });

 	button.on('mousedown', (e) => {
  		e.currentTarget.text.x += 2;
  		e.currentTarget.text.y += 2;
			e.currentTarget.texture = e.currentTarget.pressed2;
  });
  
  button.on('mouseup', (e) => {
  		e.currentTarget.text.x -= 2;
  		e.currentTarget.text.y -= 2;
			e.currentTarget.texture = e.currentTarget.pressed;
  });
  
  button.on('touchstart', (e) => {
  		e.currentTarget.text.x += 2;
  		e.currentTarget.text.y += 2;
			e.currentTarget.texture = e.currentTarget.pressed2;
  });
  
  button.on('touchend', (e) => {
  		e.currentTarget.text.x -= 2;
  		e.currentTarget.text.y -= 2;
			e.currentTarget.texture = e.currentTarget.pressed;
  });
  
}
