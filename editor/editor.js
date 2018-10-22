
var loader = PIXI.loader;
loader
	.add('bunnyImage', 'https://i.imgur.com/OznJzMp.png')
	.once('complete', function(loader, resources) {
		loadComplete();
	})
    .load();

var Rectangle = PIXI.Rectangle;
var stageDiv = document.getElementById('stage');

var renderer = PIXI.autoDetectRenderer(653, 679, {backgroundColor : 0xffffff});
var stage = new PIXI.Container();
stageDiv.appendChild(renderer.view);

var container = new PIXI.Container();
var container2 = new PIXI.Container();
var container3 = new PIXI.Container();

container2.hitArea = new PIXI.Rectangle(0, 0, renderer.width/renderer.resolution, renderer.height/renderer.resolution);

stage.addChild(container);
stage.addChild(container2);
stage.addChild(container3);

//bunny.anchor.set(0.5);
container2.interactive = true;
container2
  .on('mousedown', onDragStart)
  .on('touchstart', onDragStart)
// events for drag end
  .on('mouseup', onDragEnd)
  .on('mouseupoutside', onDragEnd)
  .on('touchend', onDragEnd)
  .on('touchendoutside', onDragEnd)
// events for drag move
  .on('mousemove', onDragMove)
  .on('touchmove', onDragMove);
// move container to the center

//container.x = renderer.width / 2;
//container.y = renderer.height / 2;

var origin = null;
//requestAnimationFrame( animate );
var rectangles = {};
var rectangle;
// --------------------------

var list = [];
var bunnyTexture;
var bunny;

function loadComplete(){
 bunnyTexture = PIXI.loader.resources['bunnyImage'].texture
 bunny = new PIXI.Sprite(bunnyTexture);
 bunny.alpha = 0.6;
 container.addChild(bunny);

}

function saveLastAnswer(){
	var ele = document.getElementById('answer');
  var ele2 = document.getElementById('key');

  if (ele.value == "" && !(ele2.value in list)){
  	 var candidateKey = ele2.value;
     
     if(candidateKey in rectangles){
    	candidate = rectangles[candidateKey];
    	container2.removeChild(candidate.obj);
      delete rectangles[candidateKey];
      origin = null;
    }
    
  	return;
  }
    
  
  var rect = rectangles[ele2.value].rect;
  rectangle.lineStyle(2, 0x000000, 1);
  rectangle.drawRect(rect.x, rect.y, rect.width, rect.height);
  
  list[ele2.value] = ele.value;
  
  ele.value = "";
  
   //rectangle = new PIXI.Graphics();
    //container2.addChild(rectangle);
  
  //var textur = new PIXI.Texture(bunnyTexture, rect);
  //var sprit = PIXI.Sprite.from(textur);
  var bunnyTexture = PIXI.loader.resources['bunnyImage'].texture;
var newTex = new PIXI.Texture(bunnyTexture, rect);
var bunnys = new PIXI.Sprite(newTex);
	bunnys.x = rect.x;
  bunnys.y = rect.y;
  bunnys.alpha = 1;
 // var blurFilter2 = new PIXI.filters.BlurFilter();
 // blurFilter2.blur = 10;
  //bunnys.filters = [blurFilter2];

// let colorMatrix = new PIXI.filters.ColorMatrixFilter();
// bunnys.filters = [colorMatrix];
// colorMatrix.blackAndWhite(true);

 //let bloom = new BloomFilter();
 //bunnys.filters = [bloom];
  //bunnys.alpha = 1;
  container3.addChild(bunnys);
}

function onDragStart(event)
{
		this.data = event.data;
    var position = this.data.getLocalPosition(this); 
    var candidateKey = checkRectangles(position.x, position.y);
		
    if(candidateKey){
    	candidate = rectangles[candidateKey];
    	container2.removeChild(candidate.obj);
      delete rectangles[candidateKey];
      delete list[candidateKey];
      origin = null;

      return;
    }
		
    //document.getElementById('save').click();
    saveLastAnswer();
    
		origin = position;
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    
    this.dragging = true;
    rectangle = new PIXI.Graphics();
    container2.addChild(rectangle);
}

function onDragEnd()
{
	var lastPosition = this.data.getLocalPosition(this.parent);
  this.dragging = false;
  // set the interaction data to null
  this.data = null;
  
  var minX = Math.min(origin.x, lastPosition.x);
  var minY = Math.min(origin.y, lastPosition.y);
  var maxX = Math.max(origin.x, lastPosition.x);
  var maxY = Math.max(origin.y, lastPosition.y);
  var newRectangle = new Rectangle(minX, minY, maxX-minX, maxY-minY);
  var key = getKey(minX, minY, maxX, maxY);
  
  if(!origin)
  	return;
  
  if(checkRectanglesCollision(newRectangle)){
    	container2.removeChild(rectangle);
      origin = null;
    
  	return;
  }
   
  var keyElement = document.getElementById('key');
  
  keyElement.value = key;
  
  rectangles[key] = {obj:rectangle, rect: new Rectangle(minX, minY, maxX-minX, maxY-minY) };
        
	focus();
}

function onDragMove()
{
    if (this.dragging)
    {
    	  rectangle.clear();
        var newPosition = this.data.getLocalPosition(this.parent);
        var minX = Math.min(origin.x, newPosition.x);
  			var minY = Math.min(origin.y, newPosition.y);
  			var maxX = Math.max(origin.x, newPosition.x);
  			var maxY = Math.max(origin.y, newPosition.y);
  
        var newRectangle = new Rectangle(minX, minY, maxX-minX, maxY-minY);
				if (checkRectanglesCollision(newRectangle)){
        	rectangle.lineStyle(2, 0xffff00, 1);
        }else{
       		rectangle.lineStyle(2, 0xFF3300, 1);
        }
        
        rectangle.drawRect(origin.x, origin.y, newPosition.x - origin.x, newPosition.y - origin.y);
    }
}
 // start animating
var ticker = new PIXI.ticker.Ticker();

ticker.add(function (deltaTime) {
    renderer.render(stage);
});

ticker.start();

function checkRectangles(x, y){
	for(var i in rectangles){
  	var rect = rectangles[i].rect;  
		
  	if (rect.contains(x, y)) {
      return i;
    } 
  }
  
  return null;
}

function checkRectanglesCollision(rectangle){
	for(var i in rectangles){
  	var rect = rectangles[i].rect;  
		
  	if (hitTestRectangle(rectangle, rect)) {
      return i;
    } 
  }
  
  return null;
}


function getKey(x1, y1, x2, y2){
	return ('0000'+x1).slice(-4) + ('0000'+y1).slice(-4) + ('0000'+x2).slice(-4) + ('0000'+y2).slice(-4);
}

function focus(){
  	var ans = document.getElementById('answer');
    ans.focus();
}

var input = document.getElementById('answer');

input.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    // Trigger the button element with a click
    saveLastAnswer();
  }
});

function hitTestRectangle(r1, r2) {

  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {

    //A collision might be occurring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {

      //There's definitely a collision happening
      hit = true;
    } else {

      //There's no collision on the y axis
      hit = false;
    }
  } else {

    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
};