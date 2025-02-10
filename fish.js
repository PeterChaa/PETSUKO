(function () {
  let board;
  let boardWidth = 1000;
  let boardHeight = 500;
  let context;

  // Game state variables
  let gameStarted = false;
  let gameExplanation = "Welcome to Fish Catcher!\n\nCatch the fish using the hook.\nAvoid the sharks. Reach 30 points to win.";

  let hookWidth = 75;
  let hookHeight = 50;
  let hookX = boardWidth / 2.15;
  let hookY = boardHeight / 8;
  let hookImg;

  let hook = {
    x: hookX,
    y: hookY,
    width: hookWidth,
    height: hookHeight,
  };

  let FishermanImg;
  let fishermanX = 0;
  let fishermanY = 10;
  let fishermanWidth = 1000;
  let fishermanHeight = 120;

  let fishArray = [];
  let fishWidth = 200;
  let fishHeight = 100;
  let fishX = -5;
  let fishXX = boardWidth + 5;
  let fishleftImg, fishrightImg;

  let velocityX = +4;
  let velocityXX = -4;

  let sharkArray = [];
  let sharkWidth = 250;
  let sharkHeight = 125;
  let sharkLeftImg, sharkRightImg;

  let caughtFish = null;
  let newCaughtImg = new Image();
  newCaughtImg.src = "wheelgame/fishcaught.png";

  let score = 0;
  let gameOver = false;

  let fishInterval;
  let sharkInterval;

  // *** Feed update helper: Only increment feed counter up to a max of 3 ***
  function markGameCompleted() {
    console.log("markGameCompleted() called!");  // Debugging
    feedX = Math.min(feedX + 1, 3); // Max 3 feeds
    feedButton.textContent = `Feed x${feedX}`;
    feedButton.disabled = false; // Enable button since we have food

    console.log(`Game completed. Feed count is now: ${feedX}`);
}


  // Initialize game
  function initGame() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    hookImg = new Image();
    hookImg.src = "wheelgame/hook.png";
    hookImg.onload = function () {
      context.drawImage(hookImg, hook.x, hook.y, hook.width, hook.height);
    };

    fishleftImg = new Image();
    fishleftImg.src = "wheelgame/fish!.gif";
    fishleftImg.onload = function () {
      fishrightImg = new Image();
      fishrightImg.src = "wheelgame/fishright.gif";
      fishrightImg.onload = function () {
        showStartScreen();
        board.addEventListener("click", startGame);
      };
    };

    FishermanImg = new Image();
    FishermanImg.src = "wheelgame/fisherman.png";

    sharkLeftImg = new Image();
    sharkLeftImg.src = "wheelgame/sharkleft.png";

    sharkRightImg = new Image();
    sharkRightImg.src = "wheelgame/sharkright.png";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGame);
  } else {
    initGame();
  }

  // Start screen with explanation and "Click to Start"
  function showStartScreen() {
    context.clearRect(0, 0, board.width, board.height);
    context.fillStyle = "lightblue";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "black";
    context.font = "40px 'Jersey 10', serif";
    context.textAlign = "center";
    context.fillText("Click to Start", boardWidth / 2, boardHeight / 2 - 50);

    context.font = "20px 'Jersey 10', serif";
    let lines = gameExplanation.split("\n");
    for (let i = 0; i < lines.length; i++) {
      context.fillText(lines[i], boardWidth / 2, boardHeight / 2 + i * 25);
    }
  }

  // Start the game when clicked
  function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    board.removeEventListener("click", startGame);
    context.clearRect(0, 0, board.width, board.height);
    requestAnimationFrame(update);

    // Initial spawning intervals
    fishInterval = setInterval(placeFish, Math.random() * (500 - 1000) + 1400);
    sharkInterval = setInterval(placeShark, 3000);

    document.addEventListener("mousemove", moveHook);
  }

  // Game loop
  function update() {
    if (score >= 30) {
      clearInterval(fishInterval);
      clearInterval(sharkInterval);
      document.removeEventListener("mousemove", moveHook);
      context.clearRect(0, 0, board.width, board.height);
      new Audio("wheelgame/winsquare-6993.mp3").play();

      context.fillStyle = "black";
      context.font = "50px 'Jersey 10', serif";
      context.fillText("Game Completed!", boardWidth / 2.5, boardHeight / 2.5);
      context.font = "20px 'Jersey 10', serif";
      context.fillText("[Hit play button to find another game] Final Score: " + score, boardWidth / 2.5, boardHeight / 2);
      
      // Update feed button without interfering with the game logic
      markGameCompleted();
      return;
    }

    if (gameOver) {
      // Clear intervals when game over
      clearInterval(fishInterval);
      clearInterval(sharkInterval);

      // Play the "NOM" sound when game over
      new Audio("wheelgame/NOM.mp3").play();
      
      // Reset game state and return to start screen
      gameOver = false;
      score = 0;
      fishArray = [];
      sharkArray = [];
      caughtFish = null;
      gameStarted = false;
      context.clearRect(0, 0, board.width, board.height);
      showStartScreen();
      board.addEventListener("click", startGame);
      return;
    }

    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    context.drawImage(FishermanImg, fishermanX, fishermanY, fishermanWidth, fishermanHeight);
    context.drawImage(hookImg, hook.x, hook.y, hook.width, hook.height);

    context.fillStyle = "black";
    context.font = "20px 'Jersey 10', serif";
    context.textAlign = "left";
    context.fillText("[Collect 30 fish]    [Avoid Sharks]", 90, 30);

    for (let i = sharkArray.length - 1; i >= 0; i--) {
      let shark = sharkArray[i];
      shark.x += shark.velocity;
      context.drawImage(shark.img, shark.x, shark.y, shark.width, shark.height);

      if (detectCollision(hook, shark)) {
        gameOver = true;
        return;
      }
    }

    for (let i = fishArray.length - 1; i >= 0; i--) {
      let fish = fishArray[i];

      if (!fish.caught) {
        fish.x += fish.velocity;
        context.drawImage(fish.img, fish.x, fish.y, fish.width, fish.height);

        if (!caughtFish && detectCollision(hook, fish)) {
          fish.caught = true;
          caughtFish = fish;
          fishArray.splice(i, 1);
        }
      }
    }

    if (caughtFish) {
      context.drawImage(newCaughtImg, hook.x - 35, hook.y + hook.height / 1.5, caughtFish.width - 60, caughtFish.height - 50);

      if (hook.y < 50) {
        score += 1;
        new Audio("wheelgame/Pickup.mp3").play();
        caughtFish = null;
        document.getElementById("scoreDisplay").innerText = "Score: " + score;
      }
    }

    context.fillStyle = "black";
    context.font = "30px 'Jersey 10', serif";
    context.fillText("Score: " + score, boardWidth / 2.25, 30);
  }

  function placeFish() {
    let randomYLeft = Math.random() * (boardHeight - fishHeight);
    let randomYRight = Math.random() * (boardHeight - fishHeight);

    if (randomYLeft <= 100 || randomYRight <= 100) {
      return;
    }

    let fishleft = {
      img: fishleftImg,
      x: fishX,
      y: randomYLeft,
      width: fishWidth,
      height: fishHeight,
      velocity: velocityX,
      caught: false,
    };

    let fishright = {
      img: fishrightImg,
      x: fishXX,
      y: randomYRight,
      width: fishWidth,
      height: fishHeight,
      velocity: velocityXX,
      caught: false,
    };

    fishArray.push(fishleft);
    fishArray.push(fishright);
  }

  function placeShark() {
    let randomYLeft = Math.random() * (boardHeight - sharkHeight);
    let randomYRight = Math.random() * (boardHeight - sharkHeight);

    if (randomYLeft <= 100 || randomYRight <= 100) {
      return;
    }

    let randomVelocityLeft = Math.random() * (-4 - (-1)) + (-4);
    let randomVelocityRight = Math.random() * (4 - 1) + 1;

    setTimeout(() => {
      let sharkLeft = {
        img: sharkLeftImg,
        x: fishX,
        y: randomYLeft,
        width: sharkWidth,
        height: sharkHeight,
        velocity: randomVelocityRight,
      };
      sharkArray.push(sharkLeft);
    }, Math.random() * 2000);

    setTimeout(() => {
      let sharkRight = {
        img: sharkRightImg,
        x: fishXX,
        y: randomYRight,
        width: sharkWidth,
        height: sharkHeight,
        velocity: randomVelocityLeft,
      };
      sharkArray.push(sharkRight);
    }, Math.random() * 2000);
  }

  function moveHook(event) {
    hook.y = event.clientY < 40 ? 40 : event.clientY - hook.height / 2;
  }

  function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  }

})();
