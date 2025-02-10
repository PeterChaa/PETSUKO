let gameStarted = false;
let feedCount = 0;

function startSkillGame() { // Ensure this matches the expected function name
    if (gameStarted) return;
    gameStarted = true;

    const canvas = document.getElementById("skillCheckCanvas");
    if (!canvas) {
        console.error("Canvas not found!");
        return;
    }
    const ctx = canvas.getContext("2d");
    canvas.style.display = "block";

    canvas.width = 600;
    canvas.height = 600;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 200;

    let angle = 0;
    let speed = 0.07;
    let gameOver = false;
    let successCount = 0;
    let steakFrame = 0;

    function randomizeSuccessZone() {
        successStart = Math.random() * (Math.PI * 2);
        successEnd = successStart + Math.PI / 4;
    }

    let successStart, successEnd;
    randomizeSuccessZone();

    let SteakImg = new Image();
    SteakImg.src = "wheelgame/steak.png";

    let fireImg = new Image();
    fireImg.src = "wheelgame/fire.png";

    let panImg = new Image();
    panImg.src = "wheelgame/pan.png";

    let fireFrame = 0;
    const totalFrames = 5;
    const frameSpeed = 100;

    setInterval(() => {
        if (!gameOver && successCount < 3) {
            fireFrame = (fireFrame + 1) % totalFrames;
        }
    }, frameSpeed);

    let panFrame = 0;
    setInterval(() => {
        if (!gameOver && successCount < 3) {
            panFrame = (panFrame + 1) % 2;
        }
    }, 500);

    function nextSteakFrame() {
        if (steakFrame < 3) {
            steakFrame++;
        }
    }

    function showGameOver() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '50px "Jersey 10", sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Game Over', centerX, centerY - 40);

        const deathSound = new Audio('wheelgame/videogame-death-sound-43894.mp3');
        deathSound.play();

        setTimeout(() => {
            gameStarted = false;
        }, 2000);
    }

    function drawSkillCheck() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.font = '24px "Jersey 10", sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('[Click Steak]', centerX, 50);

        ctx.drawImage(panImg, panFrame * 480, 0, 480, 480, centerX - 75, centerY + 50, 150, 150);
        ctx.drawImage(SteakImg, steakFrame * 480, 0, 480, 480, centerX - 75, centerY - 75, 150, 150);

        if (successCount >= 3) {
            ctx.font = '30px "Jersey 10", sans-serif';
            ctx.fillStyle = "green";
            ctx.textAlign = 'center';
            ctx.fillText("Completed!", centerX, centerY + 70);

            markGameCompleted(); // Call function instead of manual feed update
            return;
        }

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, successStart, successEnd);
        ctx.strokeStyle = "green";
        ctx.lineWidth = 16;
        ctx.stroke();
        ctx.closePath();

        let x = centerX + radius * Math.cos(angle);
        let y = centerY + radius * Math.sin(angle);

        ctx.drawImage(fireImg, fireFrame * 480, 0, 480, 480, x - 40, y - 40, 80, 80);

        if (!gameOver) {
            angle += speed;
            requestAnimationFrame(drawSkillCheck);
        } else {
            showGameOver();
        }
    }

    function checkSuccess() {
        if (gameOver) return;

        let normalizedAngle = angle % (Math.PI * 2);
        let normalizedSuccessStart = successStart % (Math.PI * 2);
        let normalizedSuccessEnd = successEnd % (Math.PI * 2);

        function handleSuccess() {
            console.log("✅ Success!");
            nextSteakFrame();
            successCount++;
            let cookedSound = new Audio("wheelgame/cooked.mp3");
            cookedSound.play();
            speed = Math.min(0.8, speed + 0.15);
            randomizeSuccessZone();
        }

        if (normalizedSuccessStart > normalizedSuccessEnd) {
            if (normalizedAngle >= normalizedSuccessStart || normalizedAngle <= normalizedSuccessEnd) {
                handleSuccess();
            } else {
                console.log("❌ Failed!");
                gameOver = true;
                showGameOver();
            }
        } else {
            let midSuccessZone = (normalizedSuccessStart + normalizedSuccessEnd) / 2;
            let angleDifference = Math.abs(normalizedAngle - midSuccessZone);
            const margin = Math.PI / 8;

            if (angleDifference <= margin) {
                handleSuccess();
            } else {
                console.log("❌ Failed!");
                gameOver = true;
                showGameOver();
            }
        }
    }

    canvas.addEventListener("click", (event) => {
        const rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        x = Math.max(0, Math.min(x, 600));
        y = Math.max(0, Math.min(y, 600));

        const areaSize = 5;
        const pixelData = ctx.getImageData(x - Math.floor(areaSize / 2), y - Math.floor(areaSize / 2), areaSize, areaSize).data;

        let clicked = false;
        for (let i = 0; i < pixelData.length; i += 4) {
            const alpha = pixelData[i + 3];
            if (alpha > 10) {
                clicked = true;
                break;
            }
        }

        if (clicked) {
            checkSuccess();
        }
    });

    fireImg.onload = drawSkillCheck;
}

window.startSkillGame = startSkillGame;
