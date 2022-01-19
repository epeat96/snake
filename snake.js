const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 900;
const SNAKE_WIDTH = CANVAS_WIDTH/50;
const SNAKE_HEIGHT = CANVAS_HEIGHT/50;
const SNAKE_SIZE = [ SNAKE_WIDTH, SNAKE_HEIGHT ];
const PAGE_UP = 33;
const SQUARE_BRACKET_RIGHT = 221;
const FRAME_RATE = 5

const bite = new Howl({
    src: ['./sounds/bite.mp3']
});

const music = new Howl({
    src: ['./sounds/taka.mp3'],
    loop: true
});

const scoreText = document.getElementById('scoreText'); 

let snake = [];
let food = [];
let score = 0;

const setScore = (newGame = false) => {

    if(newGame){
        scoreText.innerHTML = 'Score: 0';
        return;
    }

    score++;
    scoreText.innerHTML = `Score: ${score*100}`;
}

const randomPosition = () => {

    let x = 0 + SNAKE_WIDTH*Math.floor(Math.random() * CANVAS_WIDTH/SNAKE_WIDTH);
    let y = 0 + SNAKE_HEIGHT*Math.floor(Math.random() * CANVAS_HEIGHT/SNAKE_HEIGHT);

    return [x,y]
}

const drawGrid = () => {
    
    stroke('black');

    for ( let x = 0; x <= CANVAS_HEIGHT; x = x + SNAKE_HEIGHT ){

        line(x,0,x,CANVAS_WIDTH);

    }

    for ( let y = 0; y < CANVAS_HEIGHT; y = y + SNAKE_HEIGHT ){

        line(0,y,CANVAS_HEIGHT,y);

    }

}

const distance = (x1, y1, x2, y2) => {
    let dist = sqrt( sq( x1 - x2 ) + sq( y1 - y2 ) );
    return dist;
}

const addSnakePiece = () => {
        let lastElement = [...snake].reverse()[0];
        let newSegment = new SnakePiece(lastElement.x - (lastElement.speed[0] * SNAKE_WIDTH) , lastElement.y - (lastElement.speed[1] * SNAKE_HEIGHT));
        newSegment.speed = [(lastElement.x - newSegment.x)/SNAKE_WIDTH, (lastElement.y - newSegment.y)/SNAKE_HEIGHT];
        snake.push(newSegment);
}

const eatFood = (index) => {
    food.splice(index,1);
}

const checkBoundaries = () => {
    let head = snake[0];

    if ( head.x < 0 || head.x > CANVAS_WIDTH || head.y < 0 || head.y > CANVAS_HEIGHT ){
        startNewGame();
    }

}

const checkFoodCollision = () => {
    
    let head = snake[0];
    let tail = [...snake].reverse()[0];

    food.forEach( (current,index) => {
        let dist = distance( head.x, head.y, current.x, current.y ) 
        if ( dist < SNAKE_WIDTH || dist < SNAKE_HEIGHT ){
            bite.load();
            bite.play();
            placeFood();
            setScore();
        }
        dist = distance( tail.x, tail.y, current.x, current.y ) 
        if ( dist < SNAKE_WIDTH || dist < SNAKE_HEIGHT ){
            addSnakePiece();
            eatFood(index);
        }

    });

}

const checkBodyCollision = () => {
    let head, body; 
    [head,...body] =[...snake];
    
    body.forEach( (current) =>{
        let dist = distance( head.x, head.y, current.x, current.y ) 
        if ( dist < SNAKE_WIDTH || dist < SNAKE_HEIGHT ){
            startNewGame();
        }
    });
}

const placeSnake = () => {
    snake = [];
    let head = new SnakePiece(...randomPosition());
    snake.push(head);
}

const startNewGame = () => {

    music.stop();
    music.play();
    music.fade(0,0.1,10000);
    placeSnake();
    placeFood(true);
    setScore(true);

}

const validPosition = (x,y) => {

    let position = []
    let valid = false;

    while ( valid === false ){
        position = randomPosition();
        snake.forEach( (current) => {
            if( position[0] !== current.x && position[1] !== current.y ){
                valid = true;
            }
        });
    }

    return position;
} 

const placeFood = (newGame = false) => {

    if ( newGame ){
        food = []
    }

    let newFood = new Food(...validPosition());
    food.push(newFood);

}

const drawFood = () => {

    food.forEach( (current) => { 

        fill('red');
        rect( current.x, current.y, ...SNAKE_SIZE );

    });

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
    frameRate(FRAME_RATE);
    startNewGame();

}

function draw(){

    background('gray');
    drawGrid();
    moveSnake();
    checkBodyCollision();
    checkBoundaries();
    drawSnake();
    drawFood();
    checkFoodCollision();
    

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
        addSnakePiece();
    }

    if ( keyCode === SQUARE_BRACKET_RIGHT ){
        placeFood();
    }

}
