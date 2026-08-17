(function () {
  let board;
  let boardWidth = 1000;
  let boardHeight = 1000;
  let context;

  // Game state variables
  let gameStarted = false;
  let gameExplanation = "Welcome to Fish Catcher!\n\nCatch the fish using the hook.\nAvoid the sharks. Reach 30 points to win.";

  // hook.png is a native 320x320 (square) sprite; draw it square so it
  // isn't squashed.
  let hookWidth = 60;
  let hookHeight = 60;
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
  // Stretched across the full board width like the original art (not kept
  // at native aspect ratio — the correctly-proportioned version read as
  // too small/silly, so this one's exempt from that rule on purpose).
  let fishermanY = 95;
  let fishermanWidth = 1000;
  let fishermanHeight = 188;
  // Top edge of the baked-in ground line within the native art (measured
  // at y:700 of 1024 tall); used to keep fish from spawning above it.
  const DOCK_LINE_TOP_FRAC = 700 / 1024;
  const WATER_TOP_Y = fishermanY + DOCK_LINE_TOP_FRAC * fishermanHeight;
  // The rod tip sits at roughly (1581, 304.5) in the native 3200x1024
  // artwork; solve for fishermanX so that point lands exactly on the
  // hook (rather than guessing an offset) — keeps them lined up even if
  // hook/fisherman sizing changes later.
  const ROD_TIP_X_FRAC = 1581 / 3200;
  const ROD_TIP_Y_FRAC = 304.5 / 1024;
  // Nudged very slightly left of the exact rod-tip/hook alignment point.
  let fishermanX = (hookX + hookWidth / 2) - ROD_TIP_X_FRAC * fishermanWidth - 15;
  const ROD_TIP_CANVAS_X = fishermanX + ROD_TIP_X_FRAC * fishermanWidth;
  const ROD_TIP_CANVAS_Y = fishermanY + ROD_TIP_Y_FRAC * fishermanHeight;
  // Cap: the hook can't be reeled up past the rod tip. Allowed to sit a
  // bit above the tip itself (rather than well below it) so there's more
  // room to reel it in.
  const HOOK_MIN_Y = ROD_TIP_CANVAS_Y - 15;

  let fishArray = [];
  // fish!.gif/fishright.gif are both natively square (1024x1024 /
  // 480x480); draw them square so the silhouette isn't squashed.
  let fishWidth = 150;
  let fishHeight = 150;
  let fishX = -5;
  let fishXX = boardWidth + 5;
  // Each fish's original gif had 2 real frames (mouth open/closed) but
  // browsers only auto-advance a gif's animation while it's attached to
  // the DOM — an offscreen Image used purely as a canvas source stays
  // frozen on frame 1. So the 2 frames are split into separate images
  // and swapped by hand on a timer instead.
  let fishLeftFrame1Img, fishLeftFrame2Img;
  let fishRightFrame1Img, fishRightFrame2Img;
  const FISH_FRAME_INTERVAL_MS = 220;

  // Speeds are in pixels/second so movement stays consistent across
  // 60Hz/120Hz/144Hz displays instead of being tied to frame count.
  let velocityX = +60;
  let velocityXX = -60;

  let sharkArray = [];
  // sharkleft.png/sharkright.png are natively 480x300 (1.6:1); draw at the
  // same ratio so they aren't squashed (was 250x125 = 2:1).
  let sharkWidth = 250;
  let sharkHeight = 156;
  let sharkLeftImg, sharkRightImg;
  // Keep sharks from spawning within reach of the hook when it's reeled
  // all the way up to its cap.
  const SHARK_MIN_SPAWN_Y = HOOK_MIN_Y + hookHeight + 80;

  let lastFrameTime = 0;

  let caughtFish = null;
  let newCaughtImg = new Image();
  newCaughtImg.src = "wheelgame/fishcaught.png";

  let score = 0;
  let gameOver = false;

  let fishInterval;
  let sharkInterval;

  // Set by stopFishGame() when switching away to another minigame, so the
  // update() rAF loop stops rescheduling itself instead of continuing to
  // run (and play sounds) behind the now-hidden canvas.
  let stopped = false;

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

    let fishImagesLoaded = 0;
    function onFishImageLoad() {
      fishImagesLoaded++;
      if (fishImagesLoaded === 4) {
        showStartScreen();
        board.addEventListener("click", startGame);
      }
    }

    fishLeftFrame1Img = new Image();
    fishLeftFrame1Img.onload = onFishImageLoad;
    fishLeftFrame1Img.src = "wheelgame/fishleft_frame1.png";

    fishLeftFrame2Img = new Image();
    fishLeftFrame2Img.onload = onFishImageLoad;
    fishLeftFrame2Img.src = "wheelgame/fishleft_frame2.png";

    fishRightFrame1Img = new Image();
    fishRightFrame1Img.onload = onFishImageLoad;
    fishRightFrame1Img.src = "wheelgame/fishright_frame1.png";

    fishRightFrame2Img = new Image();
    fishRightFrame2Img.onload = onFishImageLoad;
    fishRightFrame2Img.src = "wheelgame/fishright_frame2.png";

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
    context.font = "90px 'Jersey 10', serif";
    context.textAlign = "center";
    context.fillText("Click to Start", boardWidth / 2, boardHeight / 2 - 80);

    context.font = "40px 'Jersey 10', serif";
    let lines = gameExplanation.split("\n");
    for (let i = 0; i < lines.length; i++) {
      context.fillText(lines[i], boardWidth / 2, boardHeight / 2 + 20 + i * 48);
    }
  }

  // Start the game when clicked
  function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    stopped = false;
    board.removeEventListener("click", startGame);
    context.clearRect(0, 0, board.width, board.height);
    lastFrameTime = 0;
    requestAnimationFrame(update);

    // Initial spawning intervals
    // Fish spawn half as often as before (interval doubled).
    fishInterval = setInterval(placeFish, (Math.random() * (500 - 1000) + 1500) * 1.6);
    sharkInterval = setInterval(placeShark, 3000);

    document.addEventListener("mousemove", moveHook);
  }

  // Game loop
  function update(now) {
    if (stopped) return;
    const dt = lastFrameTime ? (now - lastFrameTime) / 1000 : 0;
    lastFrameTime = now;

    if (score >= 30) {
      clearInterval(fishInterval);
      clearInterval(sharkInterval);
      document.removeEventListener("mousemove", moveHook);
      context.clearRect(0, 0, board.width, board.height);
      new Audio("wheelgame/winsquare-6993.mp3").play();

      context.fillStyle = "black";
      context.textAlign = "center";
      context.font = "80px 'Jersey 10', serif";
      context.fillText("Game Completed!", boardWidth / 2, boardHeight / 2 - 70);
      context.font = "24px 'Jersey 10', serif";
      context.fillText("[Hit play button to find another game] Final Score: " + score, boardWidth / 2, boardHeight / 2);
      
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
    context.fillText("[Collect 30 fish]    [Avoid Sharks]", 110, 55);

    for (let i = sharkArray.length - 1; i >= 0; i--) {
      let shark = sharkArray[i];
      shark.x += shark.velocity * dt;
      context.drawImage(shark.img, shark.x, shark.y, shark.width, shark.height);

      if (detectCollision(hook, shark)) {
        gameOver = true;
        return;
      }
    }

    for (let i = fishArray.length - 1; i >= 0; i--) {
      let fish = fishArray[i];

      if (!fish.caught) {
        fish.x += fish.velocity * dt;

        fish.frameTimer += dt * 1000;
        if (fish.frameTimer >= FISH_FRAME_INTERVAL_MS) {
          fish.frameTimer -= FISH_FRAME_INTERVAL_MS;
          fish.frame = fish.frame === 0 ? 1 : 0;
        }
        let fishImg = fish.frame === 0 ? fish.frame1Img : fish.frame2Img;
        context.drawImage(fishImg, fish.x, fish.y, fish.width, fish.height);

        if (!caughtFish && detectCollision(hook, fish)) {
          fish.caught = true;
          caughtFish = fish;
          fishArray.splice(i, 1);
        }
      }
    }

    if (caughtFish) {
      context.drawImage(newCaughtImg, hook.x - 35, hook.y + hook.height / 1.5, caughtFish.width - 60, caughtFish.height - 50);

      if (hook.y <= HOOK_MIN_Y) {
        score += 1;
        new Audio("wheelgame/Pickup.mp3").play();
        caughtFish = null;
        document.getElementById("scoreDisplay").innerText = "Score: " + score;
      }
    }

    context.fillStyle = "black";
    context.font = "55px 'Jersey 10', serif";
    context.textAlign = "center";
    context.fillText("Score: " + score, boardWidth / 2, 100);
  }

  function placeFish() {
    let randomYLeft = Math.random() * (boardHeight - fishHeight);
    let randomYRight = Math.random() * (boardHeight - fishHeight);

    // Keep fish from spawning above the water line (on the dock).
    if (randomYLeft <= WATER_TOP_Y || randomYRight <= WATER_TOP_Y) {
      return;
    }

    let fishleft = {
      frame1Img: fishLeftFrame1Img,
      frame2Img: fishLeftFrame2Img,
      frame: 0,
      frameTimer: 0,
      x: fishX,
      y: randomYLeft,
      width: fishWidth,
      height: fishHeight,
      velocity: velocityX,
      caught: false,
    };

    let fishright = {
      frame1Img: fishRightFrame1Img,
      frame2Img: fishRightFrame2Img,
      frame: 0,
      frameTimer: 0,
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

    // Sharks only ever move horizontally (their y is fixed at spawn), so
    // keeping their spawn y below the hook's minimum reach is enough to
    // guarantee they can never reach up and grab the hook while it's
    // reeled all the way in.
    if (randomYLeft <= SHARK_MIN_SPAWN_Y || randomYRight <= SHARK_MIN_SPAWN_Y) {
      return;
    }

    let randomVelocityLeft = (Math.random() * (-3 - (-1)) + (-3)) * 60;
    let randomVelocityRight = (Math.random() * (3 - 1) + 1) * 60;

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
    // Canvas is displayed at a responsive CSS size but drawn at a fixed
    // internal resolution (boardWidth x boardHeight), so mouse coords need
    // to be rebased to the canvas's own box and rescaled to canvas space.
    const rect = board.getBoundingClientRect();
    const scaleY = boardHeight / rect.height;
    const canvasY = (event.clientY - rect.top) * scaleY;

    // Cap: the hook can't be reeled up past the rod tip.
    hook.y = Math.max(HOOK_MIN_Y, canvasY - hook.height / 2);
  }

  function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  }

  // fish.js drives its own start screen / click-to-start via initGame(), so
  // there's nothing extra to kick off here - this hook exists so the game
  // switcher in character.html can detect it (it was previously calling a
  // startFishGame that didn't exist at all) and correctly track fish.js as
  // the active game, which stopFishGame() below depends on.
  window.startFishGame = function () {};

  // Called when switching to a different minigame while this one is still
  // active, so its rAF loop/spawn intervals/mousemove listener don't keep
  // running (and playing sounds) behind the hidden canvas.
  window.stopFishGame = function () {
    stopped = true;
    clearInterval(fishInterval);
    clearInterval(sharkInterval);
    document.removeEventListener("mousemove", moveHook);
    if (board) {
      board.removeEventListener("click", startGame);
    }
    gameOver = false;
    gameStarted = false;
    score = 0;
    fishArray = [];
    sharkArray = [];
    caughtFish = null;
    if (context) {
      context.clearRect(0, 0, board.width, board.height);
      showStartScreen();
    }
    if (board) {
      board.addEventListener("click", startGame);
    }
  };

})();
