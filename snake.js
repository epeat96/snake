const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 900;
const SNAKE_WIDTH = CANVAS_WIDTH/50;
const SNAKE_HEIGHT = CANVAS_HEIGHT/50;
const SNAKE_SIZE = [ SNAKE_WIDTH, SNAKE_HEIGHT ];
const PAGE_UP = 33;
const SQUARE_BRACKET_RIGHT = 221;
let snake = [];
let food;

const randomPosition = () => {

    let x = 0 + SNAKE_WIDTH*Math.floor(Math.random() * CANVAS_WIDTH/SNAKE_WIDTH);
    let y = 0 + SNAKE_HEIGHT*Math.floor(Math.random() * CANVAS_HEIGHT/SNAKE_HEIGHT);

    return [x,y]
}

const placeSnake = () => {
    let head = new SnakePiece(...randomPosition());
    snake = [];
    snake.push(head);
}

const startNewGame = () => {

    placeSnake();
    placeFood();

}

const placeFood = () => {
    food = new Food(...randomPosition());
}

const drawFood = () => {

    fill('red');
    rect( food.x, food.y, ...SNAKE_SIZE );

}

const moveSnake = () => {

    let reverseSnake = [...snake].reverse();

    snake.forEach( (current,index) =>{

        current.x = current.x + current.speed[0]*SNAKE_WIDTH;
        current.y = current.y + current.speed[1]*SNAKE_HEIGHT;

        if (index !== 0  ){
            current.speed = [(snake[index - 1].x - current.x)/SNAKE_WIDTH, (snake[index - 1].y - current.y)/SNAKE_HEIGHT];
        }
    });
}

const drawSnake = () => {

    snake.forEach( (current, index) =>{

        fill('white');
        rect( current.x, current.y, ...SNAKE_SIZE );

    });
}

class Food{

    constructor(x, y){

        this.x = x; 
        this.y = y;

    }
} 
    
class SnakePiece{

    constructor(x, y){

        this.x = x; 
        this.y = y;
        this.speed = [0,0];

    }
} 

function setup() {

    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    frameRate(5);
    startNewGame();

}

function draw(){

    background('gray');
    moveSnake();
    drawSnake();
    drawFood();

}

function mouseClicked(){

    startNewGame();
    return false;

}

function keyPressed(){

    if ( keyCode === UP_ARROW ){

        snake[0].speed = [0,-1];
        return;
        
    }

    if ( keyCode === DOWN_ARROW ){

        snake[0].speed = [0,1];
        return;
        
    }

    if ( keyCode === RIGHT_ARROW ){

        snake[0].speed = [1,0];
        return;
        
    }

    if ( keyCode === LEFT_ARROW ){

        snake[0].speed = [-1,0];
        return;
        
    }

    if ( keyCode === PAGE_UP ){

        let lastElement = [...snake].reverse()[0];
        let newSegment = new SnakePiece(lastElement.x - (lastElement.speed[0] * SNAKE_WIDTH) , lastElement.y - (lastElement.speed[1] * SNAKE_HEIGHT));
        newSegment.speed = [(lastElement.x - newSegment.x)/SNAKE_WIDTH, (lastElement.y - newSegment.y)/SNAKE_HEIGHT];
        snake.push(newSegment);
        console.log(newSegment);
    }

    if ( keyCode === SQUARE_BRACKET_RIGHT ){
        placeFood();
    }

}
