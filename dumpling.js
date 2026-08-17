(function() {
    // Canvas setup
    let canvas;
    let canvasWidth = 1000;
    let canvasHeight = 1000;
    let context;

    // Dumpling properties
    let dumpWidth = 100;
    let dumpHeight = 100;
    let dumpX = canvasWidth / 2.2;
    let dumpY = canvasHeight / 2.2;
    let dumpImg = new Image();
    dumpImg.src = "wheelgame/dumpling.png";

    let dump = {
        x: dumpX,
        y: dumpY,
        width: dumpWidth,
        height: dumpHeight,
    };

    // Fire properties (assuming we have a sprite sheet for fire animation)
    let fireWidth = 100;
    let fireHeight = 100;
    let fireImg = new Image();
    fireImg.src = "wheelgame/fire.png"; // Fire sprite sheet

    var fireaudio = new Audio('wheelgame/flamesound.mp3');
    var burnaudio = new Audio('wheelgame/burn.mp3');
    var loseaudio = new Audio('wheelgame/videogame-death-sound-43894.mp3');

    let fires = []; // Array to store multiple fire objects

    // Fire Animation Properties
    let fireSpriteWidth = 480;
    let fireSpriteHeight = 480;
    // Interval (ms) between fire sprite frame changes — real time instead of
    // a frame count, so it doesn't run faster on high refresh-rate displays.
    // (3x, then 2x more faster per request — was 1666.67ms)
    const FIRE_FRAME_INTERVAL_MS = 277.78;
    let fireFrameTimer = 0;
    let advanceFireFrame = false;

    // Fire Spawning Function with Random Interval
    let spawnEnabled = true; // Flag to control whether fires should spawn
    let startTime = Date.now(); // Track when the game starts
    let spawnRateIncreaseInterval = 400; // Time interval in milliseconds (20 seconds)
    let spawnRateMultiplier = 2; // Multiplier to increase the spawn rate

    // Flag to track if the burn sound has played
    let burnSoundPlayed = false;

    // Game Over variable
    let gameOver = false;

    // Time when the dumpling is hit
    let hitTime = null;
    
    // Flag to check if the game has started
    let gameStarted = false;

    // New flag to ensure win sound is played only once.
    let winSoundPlayed = false;

    // Flag to track whether the game is completed
    let gameCompleted = false;

    // Set by stopDumplingGame() when switching away to another minigame, so
    // the animate() rAF loop and spawnFire() timeout chain both stop
    // rescheduling themselves instead of continuing to run (and play sounds)
    // behind the now-hidden canvas.
    let stopped = false;

    // Helper function to update the feed button when the game is completed.
    function markGameCompleted() {
        console.log("markGameCompleted() called!");  // Debugging
        feedX = Math.min(feedX + 1, 3); // Max 3 feeds
        feedButton.textContent = `Feed x${feedX}`;
        feedButton.disabled = false; // Enable button since we have food
    
        console.log(`Game completed. Feed count is now: ${feedX}`);
    }
    

    // Feed function - updates feed count when the game is completed
    function feed() {
        if (gameCompleted) {
            markGameCompleted();
        } else {
            console.log("Game not completed yet");
        }
    }

    // Show Start Screen
    function showStartScreen() {
        if (!context) return; // Check if context is properly initialized
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        
        // Set background color to #ffecf2
        context.fillStyle = "#ffecf2";
        context.fillRect(0, 0, canvasWidth, canvasHeight);

        context.fillStyle = "black";
        context.font = "90px 'Jersey 10', serif";
        context.textAlign = "center";
        context.fillText("Click to Start", canvasWidth / 2, canvasHeight / 2 - 80);

        context.font = "40px 'Jersey 10', serif";
        let lines = [
            "Protect the dumpling from overcooking and getting burnt.",
            "Click the fire to extinguish it before it reaches the dumpling!"
        ];
        for (let i = 0; i < lines.length; i++) {
            context.fillText(lines[i], canvasWidth / 2, canvasHeight / 2 + 20 + i * 48);
        }
    }

    // Start the game
    function startGame() {
        gameStarted = true;
        stopped = false;
        // Reset startTime here if you wish the timer to start on game start:
        startTime = Date.now();
        // Also reset winSoundPlayed in case of replay:
        winSoundPlayed = false;
        gameCompleted = false; // Ensure gameCompleted is reset on start
        context.clearRect(0, 0, canvasWidth, canvasHeight);  // Clear the canvas to prepare for the game
        lastFrameTime = 0;
        requestAnimationFrame(animate); // Start the game animation
        spawnFire(); // Start the fire spawning
    }

    // Function to process a click for extinguishing fires
    function extinguishFire(event) {
        // Get the canvas bounding rectangle
        let rect = canvas.getBoundingClientRect();
        // Compute the proper canvas coordinates using scaling factors
        let scaleX = canvas.width / rect.width;
        let scaleY = canvas.height / rect.height;
        let mouseX = (event.clientX - rect.left) * scaleX;
        let mouseY = (event.clientY - rect.top) * scaleY;

        console.log("Click at (canvas coords):", mouseX, mouseY); // Debug log

        // Define the maximum distance for "near click"
        let maxDistance = 100;

        // Loop through the fires array to check if any fire is clicked near
        for (let i = 0; i < fires.length; i++) {
            let fire = fires[i];

            // Calculate the center of the fire
            let fireCenterX = fire.x + fire.width / 2;
            let fireCenterY = fire.y + fire.height / 2;

            // Calculate distance between mouse click and fire center
            let dx = mouseX - fireCenterX;
            let dy = mouseY - fireCenterY;
            let distance = Math.sqrt(dx * dx + dy * dy);

            console.log("Checking fire", i, "at", fireCenterX, fireCenterY, "distance:", distance);

            // If the click is near the fire, remove it and play the flamesound (allow overlapping)
            if (distance <= maxDistance) {
                fires.splice(i, 1);
                fireaudio.cloneNode().play();
                break;
            }
        }
    }

    // Single click handler for the canvas
    function canvasClickHandler(event) {
        if (!gameStarted) {
            startGame();
        } else {
            extinguishFire(event);
        }
    }

    // Fire spawning and movement
    function spawnFire() {
        if (!spawnEnabled || stopped) return;

        let side = Math.floor(Math.random() * 4);
        let x, y;

        if (side === 0) {
            x = Math.random() * canvasWidth;
            y = 0;
        } else if (side === 1) {
            x = canvasWidth;
            y = Math.random() * canvasHeight;
        } else if (side === 2) {
            x = Math.random() * canvasWidth;
            y = canvasHeight;
        } else {
            x = 0;
            y = Math.random() * canvasHeight;
        }

        fires.push({
            x: x,
            y: y,
            width: fireWidth,
            height: fireHeight,
            speed: 144, // pixels/second (was 2px/frame at an assumed 60fps; +20%)
            frameX: 0,
            frameY: 0,
            animateFire: function() {
                if (advanceFireFrame) {
                    if (this.frameX < 3) this.frameX++;
                    else this.frameX = 0;
                }
            }
        });

        let elapsedTime = Date.now() - startTime;
        let spawnInterval = Math.random() * (400 - 1000) + 1000;
        let multiplesOf20Sec = Math.floor(elapsedTime / spawnRateIncreaseInterval);
        if (multiplesOf20Sec > 0) {
            spawnInterval = Math.max(500, spawnInterval - multiplesOf20Sec * 200);
        }
        setTimeout(spawnFire, spawnInterval);
    }

    // Move Fire Towards Dumpling
    function moveFires(dt) {
        for (let i = 0; i < fires.length; i++) {
            let fire = fires[i];
            let dx = dump.x - fire.x;
            let dy = dump.y - fire.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= dump.width / 2) {
                spawnEnabled = false;
                if (frameX < 4) {
                    frameX = 4;
                }
                if (!hitTime) {
                    hitTime = Math.floor((Date.now() - startTime) / 1000);
                }
                break;
            }
            fire.x += (dx / distance) * fire.speed * dt;
            fire.y += (dy / distance) * fire.speed * dt;
            fire.animateFire();
        }
    }

    // Animation Loop
    let spriteWidth = 480;
    let spriteHeight = 480;
    let frameX = 2;
    // Interval (ms) between dumpling sprite frame changes — real time
    // instead of a frame count, so it doesn't run faster on high
    // refresh-rate displays. (3x, then 2x more faster per request — was 1666.67ms)
    const STAGGER_INTERVAL_MS = 277.78;
    let staggerTimer = 0;
    let lastFrameTime = 0;

    function animate(now) {
        if (stopped) return;
        const dt = lastFrameTime ? (now - lastFrameTime) / 1000 : 0;
        lastFrameTime = now;

        staggerTimer += dt * 1000;
        let advanceStaggerFrame = false;
        if (staggerTimer >= STAGGER_INTERVAL_MS) {
            staggerTimer -= STAGGER_INTERVAL_MS;
            advanceStaggerFrame = true;
        }

        fireFrameTimer += dt * 1000;
        advanceFireFrame = false;
        if (fireFrameTimer >= FIRE_FRAME_INTERVAL_MS) {
            fireFrameTimer -= FIRE_FRAME_INTERVAL_MS;
            advanceFireFrame = true;
        }

        context.clearRect(0, 0, canvasWidth, canvasHeight);

        // Check win condition: if 30 seconds have elapsed, display game completed screen.
        let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        if (elapsedTime >= 30 && !gameCompleted) {
            gameCompleted = true; // Mark the game as completed
            spawnEnabled = false; // stop further spawning
            context.clearRect(0, 0, canvasWidth, canvasHeight);
            // Set background color to #ffecf2
            context.fillStyle = "#ffecf2";
            context.fillRect(0, 0, canvasWidth, canvasHeight);
            context.fillStyle = "black";
            context.font = "80px 'Jersey 10', serif";
            context.textAlign = "center";
            context.fillText("Game Completed!", canvasWidth / 2, canvasHeight / 2 - 70);
            context.font = "24px 'Jersey 10', serif";
            context.fillText("[Hit play button to find another game] Final Score: " + elapsedTime, canvasWidth / 2, canvasHeight / 2);
            if (!winSoundPlayed) {
                new Audio("wheelgame/winsquare-6993.mp3").play();
                winSoundPlayed = true;
                markGameCompleted();  // Update the feed button when win condition is met.
            }
            return;
        }

        if (gameOver) {
            context.fillStyle = "red";
            context.textAlign = "center";
            context.textBaseline = "alphabetic";
            context.font = "100px 'Jersey 10', serif";
            context.fillText("Game Over!", canvasWidth / 2, canvasHeight / 2 - 80);
            if (hitTime !== null) {
                context.font = "48px 'Jersey 10', serif";
                context.fillText("Burned at: " + hitTime + "s", canvasWidth / 2, canvasHeight / 2 + 10);
            }
            return;
        }

        // Draw the dumpling
        context.drawImage(
            dumpImg,
            frameX * spriteWidth,
            0,
            spriteWidth,
            spriteHeight,
            canvasWidth / 2.4,
            canvasHeight / 2.4,
            150,
            150
        );

        moveFires(dt);

        // Draw all fires
        for (let i = 0; i < fires.length; i++) {
            let fire = fires[i];
            context.drawImage(
                fireImg,
                fire.frameX * fireSpriteWidth,
                fire.frameY * fireSpriteHeight,
                fireSpriteWidth,
                fireSpriteHeight,
                fire.x,
                fire.y,
                fire.width,
                fire.height
            );
        }

        if (!spawnEnabled && frameX < 11) {
            if (advanceStaggerFrame) {
                frameX++;
                if (!burnSoundPlayed) {
                    burnaudio.play();
                    burnSoundPlayed = true;
                }
            }
        } else if (frameX >= 11) {
            frameX = 11;
            loseaudio.play();
            gameOver = true;
        }

        if (spawnEnabled && advanceStaggerFrame) {
            if (frameX < 3) frameX++;
            else frameX = 0;
        }

        // Draw elapsed time text at the top of the canvas
        context.font = "40px 'Jersey 10', serif";
        context.fillStyle = "red";
        context.textAlign = "center";
        context.textBaseline = "top";
        context.fillText("Time: " + elapsedTime + "s", canvasWidth / 2, 100);

        requestAnimationFrame(animate);
    }

    // In startDumplingGame, ensure the canvas is visible and attach the click handler.
    // Minimal changes: reset game state so that the start screen is shown on replay.
    window.startDumplingGame = function() {
        console.log("Dumpling game started!");
        canvas = document.getElementById("dumplingBoard");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        context = canvas.getContext("2d");
        // Make sure the canvas is visible (CSS still applies for layout)
        canvas.style.display = "block";
        
        // Reset the game state so that the start screen is shown again.
        gameStarted = false;
        gameOver = false;
        fires = [];
        startTime = Date.now();
        fireFrameTimer = 0;
        staggerTimer = 0;
        lastFrameTime = 0;
        frameX = 2;
        burnSoundPlayed = false;
        hitTime = null;
        spawnEnabled = true;
        winSoundPlayed = false;
        gameCompleted = false; // Reset completion flag
        
        // Remove any previous click listener (if reloading the game)
        canvas.removeEventListener("click", canvasClickHandler);
        // Attach the unified click handler
        canvas.addEventListener("click", canvasClickHandler);
        showStartScreen();
    };

    // Called when switching to a different minigame while this one is still
    // active, so its loop/spawn-timer/listener don't keep running (and
    // playing sounds) behind the hidden canvas.
    window.stopDumplingGame = function() {
        stopped = true;
        spawnEnabled = false;
        gameStarted = false;
        if (canvas) {
            canvas.removeEventListener("click", canvasClickHandler);
        }
    };
})();
