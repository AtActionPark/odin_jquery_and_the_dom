const DIMENSION = 40;
var grid = {};
var snake;
var food;
var play = false;
var score = 0;
var initSpeed = 100;
var speed;

$(document).ready(function(){
  home();
});

var playGame = function () {

  $('.score').text("Score : "+score);
  $('.home').hide();
  $('.gameOver').hide();
  $('#board').show();
  $(document).keydown(changeDirection);
  setTimeout(move, speed);
}

var home = function(){
  $('.gameOver').hide();
  $('.score').text("Score : "+score);
  init();
}

var gameOver = function(){
  $('.gameOver').show();
    init();
}

var makeGrid = function() {
  for (var i = 0; i<DIMENSION; i++) {
    grid[i] = [];
    for (var j = 0; j<DIMENSION; j++) {
      grid[i].push(" ");
    }
  }
};

var makeSnake = function(){
  snake = {
    headPosition :  [20,20],
    positionArray :  [[20,20]],
    direction :  'r'
  }
}

var createBoard = function(grid){
  for (var i = 0; i<DIMENSION; i++) {
    for (var j = 0; j<DIMENSION; j++) {
      var tile = $('<div/>', {
            text: grid[i][j],
            'class': 'tile ' + i + '-' + j,
          });
      $('#board').append(tile);
    }
  }
}

var destroyBoard = function(grid){
  $('#board').empty();
}

var init = function(){
  reset();
  play = true;
  makeGrid();
  createBoard(grid);
  makeSnake();
  drawSnake();

  makeFood();
}

var reset = function(){
  destroyBoard();
  score = 0;
  speed = initSpeed;
}

var changeDirection = function(event){
  event.preventDefault;
  switch (event.which) {
      case 37:
        console.log("pressed left");
        if (snake.direction !== 'r') { snake.direction = 'l'; }
        break;
      case 38:
        console.log("pressed up");
        if (snake.direction !== 'd') { snake.direction = 'u'; }
        break;
      case 39:
        console.log("pressed right");
        if (snake.direction !== 'l') { snake.direction = 'r'; }
        break;
      case 40:
        console.log("pressed down");
        if (snake.direction !== 'u') { snake.direction = 'd'; }
        break;
      }
}

var move = function(){
  var x = snake.headPosition[0];
  var y = snake.headPosition[1];

  $('#board').find('.'+x+'-'+y).removeClass('head');
  switch (snake.direction){
  case 'd':
    snake.headPosition[0] +=1;
    break;
  case 'u':
    snake.headPosition[0] -=1;
    break;
  case 'l':
    snake.headPosition[1] -=1;
    break;
  case 'r':
    snake.headPosition[1] +=1;
    break;
  }

  x = snake.headPosition[0];
  y = snake.headPosition[1];
  $('#board').find('.'+snake.positionArray[0][0]+'-'+snake.positionArray[0][1]).removeClass('snake');
  snake.positionArray.shift();
  snake.positionArray.push([x,y]);
  

  if (isOutOfBounds() || eatItself() ){
    gameOver();
    return;
  }

  if (isEatingFood())
  {
    eatFood();
  }

  drawSnake();
  setTimeout(move, speed);
}

var isOutOfBounds = function(){
  var x = snake.headPosition[0];
  var y = snake.headPosition[1];

  return x<0 || x>39 || y<0 || y>39;
}

var drawSnake = function(){
  var x = snake.headPosition[0];
  var y = snake.headPosition[1];
  $('#board').find('.'+x+'-'+y).addClass('head');

  for( var i = 0;i<snake.positionArray.length;i++){
    var j = snake.positionArray[i][0];
    var k = snake.positionArray[i][1];
    $('#board').find('.'+j+'-'+k).addClass('snake');
  }
}

var makeFood = function(){
  var x = Math.floor(Math.random() * 39) + 1 ; 
  var y = Math.floor(Math.random() * 39) + 1 ; 
  food = {
      position :  [x,y],
    }
  $('#board').find('.'+x+'-'+y).addClass('food');
}

var isEatingFood = function(){
  return snake.headPosition[0] == food.position[0] && snake.headPosition[1] == food.position[1]
}

var eatFood = function(){
  $('#board').find('.'+food.position[0]+'-'+food.position[1]).removeClass('food');
  score+= snake.positionArray.length;
  if (speed > 20)
    speed -=2;
  $('.score').text("Score : "+score);
  grow();
  makeFood();
  
}

var grow = function(){
  var pos = [snake.headPosition[0],snake.headPosition[1]]
  snake.positionArray.unshift(pos);
}

var eatItself = function(){
  var arr = snake.positionArray.slice();
  arr.pop();
  for (var i = 0;i<arr.length;i++){
    if (arrayEql(arr[i], snake.headPosition))
      return true;
  }
  return false;
}

var arrayEql = function(a,b){
  return a[0] == b[0] && a[1] == b[1];
}



