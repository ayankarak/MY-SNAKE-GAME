console.log("Welcome To The Game!!");
document.addEventListener("DOMContentLoaded", function() {
    const gameArena=document.getElementById("game-arena");
    //console.log(gameArena);
    const arenaSize=600;
    const cellSize=20;
    let score=0;  // score of the game
    let gameStarted=false; //game status
    let food={x:300,y:200}//food position {x:15*20,y:10*20}->cell coordinate->pixels}
    let snake=[{x:160,y:200},{x:140,y:200},{x:120,y:200}];
    let dx=cellSize; //+20
    let dy=0; //0
    let intervalId;
    let gamespeed=200;

    function moveFood() {
        let newX,newY;
        do{
            newX=Math.floor(Math.random()*30)*cellSize;//arenaSize/cellSize
            newY=Math.floor(Math.random()*30)*cellSize;
        }while(snake.some(snakecell => snakecell.x===newX && snakecell.y===newY));
        food={x:newX,y:newY};
    }

    function UpdateSnake() {
        const newhead={x:snake[0].x+dx,y:snake[0].y+dy};//new head position
        snake.unshift(newhead);//add new head to the snake

        //check collision with food
        if(newhead.x===food.x && newhead.y===food.y){
            score+=10;//increment score
            moveFood(); //move food to new position
            if(gameSpeed>50){
                clearInterval(intervalId);
                gameSpeed-=10;//increase game speed
                gameLoop(); //restart the game loop with new speed
            }
        }
        else{
            snake.pop();//remove tail
        }
    }

    
    function changeDirection(e){
        console.log("key pressed",e);
        const isGoingDown=dy===cellSize;
        const isGoingUp=dy===-cellSize;
        const isGoingLeft=dx===-cellSize;
        const isGoingRight=dx===cellSize;
        if(e.key==="ArrowUp"&&!isGoingDown){
            dx=0;
            dy=-cellSize;
        }
        else if(e.key==="ArrowDown"&&!isGoingUp){
            dx=0;
            dy=cellSize;
        }
        else if(e.key==="ArrowLeft"&&!isGoingRight){
            dx=-cellSize;
            dy=0;
        }
        else if(e.key==="ArrowRight"&&!isGoingLeft){
            dx=cellSize;
            dy=0;
        }
    }

    function drawDiv(x,y,className) {
        const divElement=document.createElement("div");
        divElement.classList.add(className);
        divElement.style.top=`${y}px`;
        divElement.style.left=`${x}px`;
        return divElement;
    }

    function drawFoodandSnake() {
        gameArena.innerHTML="";//clear the arena before redrawing
        //wipe out everything and redraw with new positions
        
        snake.forEach((snakecell) => {
            const snakeElement=drawDiv(snakecell.x,snakecell.y,"snake");
            gameArena.appendChild(snakeElement);
        });
        const foodElement=drawDiv(food.x,food.y,"food");
        gameArena.appendChild(foodElement);
    }

    function isGameover() {
        //snake collision check
        for(let i=4;i<snake.length;i++){
            if(snake[i].x===snake[0].x && snake[i].y===snake[0].y){
                return true;
            }
        }
        // wall collision check
        const hitLeftWall=snake[0].x<0;
        const hitRightWall=snake[0].x>=arenaSize;//-cellSize;
        const hitTopWall=snake[0].y<0;
        const hitBottomWall=snake[0].y>=arenaSize;//-cellSize;
        return hitLeftWall||hitRightWall||hitTopWall||hitBottomWall;
    }

    function showGameOverScreen() {
    const gameOverDiv = document.createElement("div");
    gameOverDiv.id = "game-over";

    gameOverDiv.innerHTML = `
        <h2>Game Over!</h2>
        <p>Your Score: ${score}</p>
        <button id="restart-btn">Restart</button>
    `;

    document.body.appendChild(gameOverDiv);

    document.getElementById("restart-btn").addEventListener("click", function () {
        gameOverDiv.remove();
        resetGame();
        runGame();
    });
}

    function gameLoop() {
        intervalId=setInterval(() => {
            if(isGameover()){
                clearInterval(intervalId);
                gameStarted=false;
                // alert('Game Over' + '\n' + 'Your Score: ' + score);
                // resetGame();
                showGameOverScreen();
                return ;
            }
            UpdateSnake();
            drawFoodandSnake();
            drawScoreBoard();
        }, gamespeed);
    }

    function runGame() {
        if(!gameStarted){
            gameStarted=true;
            document.addEventListener("keydown",changeDirection);
            // drawFoodandSnake();
            // setInterval(gameLoop,100); //game loop every 100ms
            gameLoop(); //start the game loop
        }
    }

    function showGameOverScreen() {

        const overlay = document.createElement("div");
        overlay.id = "game-over-overlay";

        overlay.innerHTML = `
            <h2>Game Over</h2>
            <p>Score: ${score}</p>
            <button id="play-again-btn">Play Again</button>
        `;

        gameArena.appendChild(overlay);

        document.getElementById("play-again-btn").addEventListener("click", function () {
            overlay.remove();
            resetGame();
            runGame();
        });
    }
    
    function resetGame() {
        score=0;
        gameSpeed=200;
        snake=[{x:160,y:200},{x:140,y:200},{x:120,y:200}];
        food={x:300,y:200}
        dx=cellSize;
        dy=0;
        
        drawFoodandSnake();
        drawScoreBoard();
    }
    function drawScoreBoard() {
        const scoreBoard=document.getElementById("score-board");
        scoreBoard.textContent=`Score: ${score}`;
    }

    function initiateGame() {
        const scoreBoard=document.createElement("div");
        scoreBoard.id="score-board";
        // scoreBoard.textContent=`Score: ${score}`;
        // gameArena.appendChild(scoreBoard);
        document.body.insertBefore(scoreBoard, gameArena);// insert scoreboard before game arena
        const startButton=document.createElement("button");
        //startButton.id="start-button";
        startButton.textContent="Start Game";
        startButton.classList.add("start-button");
        startButton.addEventListener("click", function startGame(){
            startButton.style.display="none";//hide start button after click
            runGame();
        });
        document.body.appendChild(startButton);//append start button to the body;
    }
    initiateGame();
});