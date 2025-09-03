let interval;
let score = 0;
const apple = document.querySelector('.apple');
const colorGroundEvenInput = document.querySelector('.color-ground-even-input');
const colorGroundOddInput = document.querySelector('.color-ground-odd-input');
const colorInput = document.querySelector('.color-input');
const gameOverContainer = document.querySelector('.game-over-container');
const groundColorPick = document.querySelector('.ground-color-pick');
const groundWrapper = document.querySelector('.ground-wrapper');
const highScoreElement = document.querySelectorAll('.high-score-value');
const scoreValueElement = document.querySelectorAll('.score-value');
const snake = document.querySelector('.snake');
const snakeColorPick = document.querySelector('.snake-color-pick');
const soundIcon = document.querySelector('.sound-icon');

// Variables
let randomApplePosition,
    position,
    step,
    direction,
    tempSnakePosition,
    clonedSnake,
    isGameOver;

let snakePosition;

createGridColors();
createGridColorsPick();
resetGameConfig();

function resetGameConfig() {
    position = 'x', step = 1, direction = 'Right';
    randomApplePosition = { x: randomPosition(1, 15), y: randomPosition(1, 15) };

    apple.style.gridArea = `${randomApplePosition.y} / ${randomApplePosition.x}`;

    snakePosition = { x: 2, y: 8 };
    tempSnakePosition = { ...snakePosition };
    snake.style.gridArea = `${snakePosition.y} / ${snakePosition.x}`;
}

// Audios
const eatFoodAudio = new Audio('./audios/eat_food.mp3');
const gameOverAudio = new Audio('./audios/gameOver.mp3');
const moveSnakeAudio = new Audio('./audios/move.mp3');
const startGameAudio = new Audio('./audios/game_music.mp3');

document.addEventListener('keydown', changeDirection);
function changeDirectionHandler(
    allowedDirections,
    updatedAngle,
    updatedDirection,
    updatedPosition,
    updatedStep,
) {
    if (allowedDirections.includes(direction) && !isGameOver) {
        position = updatedPosition;
        step = updatedStep;
        direction = updatedDirection;

        clonedSnake.style.transform = `rotate(${updatedAngle}deg)`;
    }
    moveSnakeAudio.play();
}

function changeDirection(event) {
    const keyPressed = event.key;

    switch (keyPressed) {
        case 'ArrowUp':
            changeDirectionHandler(['Right', 'Left'], 0, 'Up', 'y', -1);

            break;
        case 'ArrowDown':
            changeDirectionHandler(['Right', 'Left'], 180, 'Down', 'y', 1);

            break;
        case 'ArrowLeft':
            changeDirectionHandler(['Up', 'Down'], 270, 'Left', 'x', -1);

            break;
        case 'ArrowRight':
            changeDirectionHandler(['Up', 'Down'], 90, 'Right', 'x', 1);

            break;
    }
}

function createCellElement(eatenApple = false) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    eatenApple && cell.classList.add('eaten-apple');
    cell.style.gridArea = `${tempSnakePosition.y} / ${tempSnakePosition.x}`;

    groundWrapper.prepend(cell);
}

function moveSnake() {
    const cells = document.querySelectorAll('.cell');
    const firstCell = cells[0];
    clonedSnake = firstCell.cloneNode(true);

    tempSnakePosition = { ...snakePosition };
    snakePosition[position] += step;

    handleCollisions();
    if (isGameOver) return;

    if (cells.length > 1 && !isGameOver) {
        createCellElement();
    }
    groundWrapper.prepend(clonedSnake);
    firstCell.remove();

    clonedSnake.style.gridArea = `${snakePosition.y} / ${snakePosition.x}`;
    cells[cells.length - 1].remove();
}

function handleCollisions() {
    const cells = document.querySelectorAll('.cell:not(.snake)');
    // Hitting walls.
    if (snakePosition[position] > 15 || snakePosition[position] < 1) {
        endGame();

        return;
    }

    // Snake hitting itself.
    cells.forEach((cell) => {
        if (cell.style.gridArea === clonedSnake.style.gridArea) {
            endGame();

            return;
        }
    });

    // Eating apple.
    if (apple.style.gridArea === clonedSnake.style.gridArea) {
        createCellElement(true);
        score ++;
        scoreValueElement[0].textContent = score;
        scoreValueElement[1].textContent = score;

        eatFoodAudio.play();

        const cells = document.querySelectorAll('.cell');
        console.log(cells);

        let newApplePosition = { x: randomPosition(1, 15), y: randomPosition(1, 15) };
        // do {
        //     newApplePosition = { x: randomPosition(1, 15), y: randomPosition(1, 15) };
        // } while (`${newApplePosition.y} / ${newApplePosition.x}`);


        apple.style.gridArea = `${newApplePosition.y} / ${newApplePosition.x}`;
    }
}

function createGridColors() {
    for (let i = 1; i <= 15; i++) {
        for (let j = 1; j <= 15; j++) {
            const cell = document.createElement('div');
            cell.style.transform = `translate(${(j - 1) * 40}px, ${(i - 1) * 40}px)`;
            if ((i + j) % 2 === 0) {
                cell.classList.add('even');
            } else {
                cell.classList.add('odd');
            }
            groundWrapper.appendChild(cell);
        }
    }
}

function createGridColorsPick() {
    for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 10; j++) {
            const cell = document.createElement('div');
            if ((i + j) % 2 === 0) {
                cell.classList.add('even');
            } else {
                cell.classList.add('odd');
            }

            cell.addEventListener('click', openGroundColorPick);
            groundColorPick.appendChild(cell);
        }
    }
}

function toggleSoundGame() {
    let currentSoundIcon = soundIcon.style.backgroundImage;

    if (currentSoundIcon === 'url("./icons/sound.png")') {
        currentSoundIcon = 'url("./icons/mute.png")'
        startGameAudio.load();
    } else {
        currentSoundIcon = 'url("./icons/sound.png")';
        startGameAudio.loop = true;
        startGameAudio.volume = 0.3;
        startGameAudio.play();
    }

    soundIcon.style.backgroundImage = currentSoundIcon;
}

function getStoreHighScore() {
    const highScoreValue = localStorage.getItem('hightScore') || 0;

    highScoreElement[0].textContent = highScoreValue;
    highScoreElement[1].textContent = highScoreValue;


    return highScoreValue;
}

function setStoreHighScore() {
    const currentHighScore = getStoreHighScore();

    if (parseInt(currentHighScore) < score) {
        localStorage.setItem('hightScore', score);
        highScoreElement[0].textContent = highScoreValue;
        highScoreElement[1].textContent = highScoreValue;
    }
}

// Snake pick color.
function changeSnakeColor(event) {
    const chosenColor = event.target.value;

    document.documentElement.style.setProperty("--cell-color", chosenColor);
}

function handleColorPick(event) {
    const chosenColor = event.target.value;
    snakeColorPick.style.backgroundColor = chosenColor;
}

function openColorPick() {
    colorInput.click();
}

// Ground pick color.
function changeGroundColor(event) {
    const chosenColor = event.target.value;

    if (event.target.classList[0] === 'color-ground-odd-input') {
        document.documentElement.style.setProperty("--odd-cell-color", chosenColor);

        return;
    };

    document.documentElement.style.setProperty("--even-cell-color", chosenColor);
}

function handleGroundColorPick(event) {
    const chosenColor = event.target.value;
    let cells;

    if (event.target.classList[0] === 'color-ground-odd-input') {
        cells = groundColorPick.querySelectorAll('.odd');
    } else {
        cells = groundColorPick.querySelectorAll('.even');
    }

    cells.forEach((cell) => {
        cell.style.backgroundColor = chosenColor;
    });
}

function openGroundColorPick(event) {
    if (event.target.classList[0] === 'even') {
        colorGroundEvenInput.click();

        return;
    }

    colorGroundOddInput.click();
}


// todo fix random position function to avoid apple spawning on snake
function randomPosition(min, max) {
    return Math.round((Math.random() * (max - min) + min));
}

function startGame() {
    toggleSoundGame();
    interval = setInterval(moveSnake, 150);

    startGameAudio.loop = true;
    startGameAudio.volume = 0.3;
    startGameAudio.play();
}

function endGame() {
    gameOverContainer.classList.remove('hide');
    isGameOver = true;

    startGameAudio.load();
    gameOverAudio.play();

    setStoreHighScore();

    clearInterval(interval);
    return;
}

function handlePlayAgain() {
    gameOverContainer.classList.add('hide');
    score = 0;
    isGameOver = false;

    const cells = document.querySelectorAll('.cell');
    cells[0].style.transform = 'rotate(90deg)';
    for (let index = 1; index < cells.length; index++) {
        const element = cells[index];
        element.remove()
    }

    resetGameConfig();
    startGame();
}
