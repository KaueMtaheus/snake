const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

const audio = new Audio('./assets/audio.mp3');

const size = 30;

const snake = [{ x: 270, y: 240 }];

let direction, loopId;


const incrementScore = () => {
    const currentScore = parseInt(score.textContent, 10);
    score.textContent = currentScore + 10;
};

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
};

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number / 30) * 30;
};

const randomColor = () => {
    const red = randomNumber(0, 255);
    const blue = randomNumber(0, 255);
    const pink = randomNumber(0, 255);

    return `rgb(${red}, ${blue}, ${pink})`
};

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor(),
};


const drawFood = () => {
  
    const { x, y, color } = food;
  
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.fillStyle = food.color;
    ctx.fillRect(food.x, food.y, size, size);
    ctx.shadowBlur = 0;
};


const drawSnake = () => {
    ctx.fillStyle = "#ddd";
    
    snake.forEach((position, index) => {
       
       if (index == snake.length - 1) {
            ctx.fillStyle = "green";
       }
          
        ctx.fillRect(position.x, position.y, size, size);
    });
};

const moveSnake = () => {
    if (!direction) return;
    
    const head = snake[snake.length - 1];

    
    if (direction == "right"){
        snake.push({ x: head.x + size, y: head.y });
    }

    if (direction == "left"){
        snake.push({ x: head.x - size, y: head.y });
    }

    if (direction == "down"){
        snake.push({ x: head.x, y: head.y + size });
    }

    if (direction == "up"){
        snake.push({ x: head.x, y: head.y - size});
    }

    snake.shift();
};

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#292929";

    for (let i = 30; i < canvas.width; i += 30){
        ctx.beginPath();
        ctx.lineTo(i, 0);
        ctx.lineTo(i, 600);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineTo(0, i);
        ctx.lineTo(600, i);
        ctx.stroke();
    }

};

const checkEat = () => {
    const head = snake[snake.length - 1];

    if (head.x === food.x && head.y === food.y) {
        snake.push({ ...head});
        audio.play();
        generateNewFoodPosition();
        incrementScore();
    }  
};

const generateNewFoodPosition = () => {
    food.x = randomPosition();
    food.y = randomPosition();
    food.color = randomColor();
};
 
const checkCollision = () => {
    const head = snake[snake.length - 1];
    const canvasLimit = canvas.width - size;
    const neckIndex = snake.length - 2;


    const wallCollision = 
       head.x < 0 || head.x > 570 || head.y < 0 || head.y > 570;

    
    const selfCOllision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y;
    }) ;

    if (wallCollision || selfCOllision) {
        gameOver();
    }
}


const gameOver = () => {
    direction = undefined;

    menu.style.display = "flex";
    finalScore.textContent = score.textContent;
    canvas.style.filter = "blur(2px)"; // Corrigi o filtro
};



const gameLoop = () => {
    clearInterval(loopId);

    ctx.clearRect(0, 0, 600, 600);
    drawGrid();
    drawFood();
    moveSnake();
    drawSnake();
    checkEat();
    checkCollision();

    loopId = setTimeout(() => {
        gameLoop();
    }, 300);
};

gameLoop();

document.addEventListener("keydown", ({ key }) => {
    
    if (key == "ArrowRight" && direction != "left") {
        direction = "right";
    }

    if (key == "ArrowLeft" && direction != "right") {
        direction = "left";
    }

    if (key == "ArrowUp" && direction != "down") {
        direction = "up";
    }

    if (key == "ArrowDown" && direction != "up") {
        direction = "down";
    }

});

buttonPlay.addEventListener("click", () => {
    score.textContent = "0"; // Iniciar o score em 0
    menu.style.display = "none";
    canvas.style.filter = "none";
    snake.length = 1;
    direction = undefined;
    gameLoop();
});
