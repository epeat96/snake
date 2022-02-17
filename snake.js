const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const SNAKE_WIDTH = CANVAS_WIDTH / 50;
const SNAKE_HEIGHT = CANVAS_HEIGHT / 50;
const SNAKE_SIZE = [SNAKE_WIDTH, SNAKE_HEIGHT];
const COMMA = 188;
const W = 87;
const A = 65;
const S = 83;
const D = 68;
const PERIOD = 190;
const volumeSlider = document.getElementById('volume');
let DIFFICULTY = 10;
const body = document.body;

const bite = new Howl({
    src: ['./sounds/bite.mp3']
});

let music = WaveSurfer.create({
    container: "#waveform",
    waveColor: '#5B88C8',
    progressColor: '#264E73'
});
music.load('./sounds/taka.mp3');

volumeSlider.onchange = () => {
    var newVolume = volumeSlider.value * 0.01;
    music.setVolume(newVolume);
    Howler.volume(newVolume);
}


const shake = (shakeNow = true) => {

    if (shakeNow) {
        body.style.cssText += 'animation : shake 1s;animation-iteration-count: infinite';
    } else {
        body.style.animation = '';
    }

}

music.on('audioprocess', function (e) {
    analyser.getByteFrequencyData(frequencyData);
    var w = frequencyData[0] * 0.05;
    if (w < 10) {

        shake(false);

    } else if (w >= 10 && w < 12) {

        shake();

    } else if (w >= 12) {

        filter(INVERT);

    }

});

music.setVolume(volumeSlider.value * 0.001);

music.on('finish', () => music.play());

let analyser = music.backend.analyser,
    frequencyData = new Uint8Array(analyser.frequencyBinCount);

const scoreText = document.getElementById('scoreText');

let snake = [];
let food = [];
let score = 0;

const setScore = (newGame = false) => {

    if (newGame) {
        score = 0;
        scoreText.innerHTML = 'Score: 0';
        return;
    }

    score++;
    scoreText.innerHTML = `Score: ${score * 100}`;
}

const randomPosition = () => {

    let x = 0 + SNAKE_WIDTH * Math.floor(Math.random() * CANVAS_WIDTH / SNAKE_WIDTH);
    let y = 0 + SNAKE_HEIGHT * Math.floor(Math.random() * CANVAS_HEIGHT / SNAKE_HEIGHT);

    return [x, y]
}

const drawGrid = () => {

    stroke('black');

    for (let x = 0; x <= CANVAS_HEIGHT; x = x + SNAKE_HEIGHT) {

        line(x, 0, x, CANVAS_WIDTH);

    }

    for (let y = 0; y < CANVAS_HEIGHT; y = y + SNAKE_HEIGHT) {

        line(0, y, CANVAS_HEIGHT, y);

    }

}

const distance = (x1, y1, x2, y2) => {
    let dist = sqrt(sq(x1 - x2) + sq(y1 - y2));
    return dist;
}

const addSnakePiece = () => {
    let lastElement = [...snake].reverse()[0];
    let newSegment = new SnakePiece(lastElement.x - (lastElement.speed[0] * SNAKE_WIDTH), lastElement.y - (lastElement.speed[1] * SNAKE_HEIGHT));
    newSegment.speed = [(lastElement.x - newSegment.x) / SNAKE_WIDTH, (lastElement.y - newSegment.y) / SNAKE_HEIGHT];
    snake.push(newSegment);
}

const eatFood = (index) => {
    food.splice(index, 1);
}

const checkBoundaries = () => {
    let head = snake[0];

    if (head.x < 0 || head.x > CANVAS_WIDTH - SNAKE_WIDTH || head.y < 0 || head.y > CANVAS_HEIGHT - SNAKE_HEIGHT) {
        startNewGame();
    }

}

const checkFoodCollision = () => {

    let head = snake[0];
    let tail = [...snake].reverse()[0];

    food.forEach((current, index) => {
        let dist = distance(head.x, head.y, current.x, current.y)
        if (dist < SNAKE_WIDTH || dist < SNAKE_HEIGHT) {
            bite.load();
            bite.play();
            placeFood();
            setScore();
        }
        dist = distance(tail.x, tail.y, current.x, current.y)
        if (dist < SNAKE_WIDTH || dist < SNAKE_HEIGHT) {
            addSnakePiece();
            eatFood(index);
        }

    });

}

const checkBodyCollision = () => {
    let head, body;
    [head, ...body] = [...snake];

    body.forEach((current) => {
        let dist = distance(head.x, head.y, current.x, current.y)
        if (dist < SNAKE_WIDTH || dist < SNAKE_HEIGHT) {
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

    if (music.isPlaying()) {
        music.stop();
    }
    music.play();
    placeSnake();
    placeFood(true);
    setScore(true);

}

const validPosition = (x, y) => {

    let position = []
    let valid = false;

    while (valid === false) {
        snake.forEach((current) => {
            position = randomPosition();
            if (position[0] !== current.x && position[1] !== current.y) {
                valid = true;
            }
        });
    }

    return position;
}

const placeFood = (newGame = false) => {

    if (newGame) {
        food = []
    }

    let newFood = new Food(...validPosition());
    food.push(newFood);

}

const drawFood = () => {

    food.forEach((current) => {

        fill('#F06060');
        rect(current.x, current.y, ...SNAKE_SIZE);

    });

}

const moveSnake = () => {

    let reverseSnake = [...snake].reverse();

    snake.forEach((current, index) => {

        current.x = current.x + current.speed[0] * SNAKE_WIDTH;
        current.y = current.y + current.speed[1] * SNAKE_HEIGHT;

        if (index !== 0) {
            current.speed = [(snake[index - 1].x - current.x) / SNAKE_WIDTH, (snake[index - 1].y - current.y) / SNAKE_HEIGHT];
        }
    });
}

const drawSnake = () => {

    snake.forEach((current, index) => {

        fill('#F2EBBF');
        rect(current.x, current.y, ...SNAKE_SIZE);

    });
}

class Food {

    constructor(x, y) {

        this.x = x;
        this.y = y;

    }
}

class SnakePiece {

    constructor(x, y) {

        this.x = x;
        this.y = y;
        this.speed = [0, 0];

    }
}

function setup() {

    alert(`PHOTOSENSITIVE WARNING: READ BEFORE PLAYING!
A very small percentage of individuals may experience epileptic seizures when exposed to certain light patterns or flashing lights. Exposure to certain patterns or backgrounds on a computer screen, or while playing video games, may induce an epileptic seizure in these individuals. Certain conditions may induce previously undetected epileptic symptoms even in persons who have no history of prior seizures or epilepsy.

If you, or anyone in your family, have an epileptic condition, consult your physician prior to playing. If you experience any of the following symptoms while playing a video or computer game -- dizziness, altered vision, eye or muscle twitches, loss of awareness, disorientation, any involuntary movement, or convulsions -- IMMEDIATELY discontinue use and consult your physician before resuming play.`);
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    frameRate(DIFFICULTY);
    startNewGame();

    const canvas = document.getElementById('defaultCanvas0');
    canvas.onclick = () => {
        startNewGame();
    }
}

function draw() {

    background('#5C4B51');
    drawGrid();
    moveSnake();
    checkBoundaries();
    checkBodyCollision();
    drawSnake();
    drawFood();
    checkFoodCollision();


}

function keyPressed() {

    if (keyCode === UP_ARROW || keyCode === W) {

        snake[0].speed = [0, -1];
        return;

    }

    if (keyCode === DOWN_ARROW || keyCode === S) {

        snake[0].speed = [0, 1];
        return;

    }

    if (keyCode === RIGHT_ARROW || keyCode === D) {

        snake[0].speed = [1, 0];
        return;

    }

    if (keyCode === LEFT_ARROW || keyCode === A) {

        snake[0].speed = [-1, 0];
        return;

    }

    if (keyCode === COMMA) {
        addSnakePiece();
    }

    if (keyCode === PERIOD) {
        placeFood();
    }

}
