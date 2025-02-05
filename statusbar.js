let statusLevel = 0;
const maxStatus = 100;
const increaseAmount = maxStatus / 3; // Increase by 1/3

let feedX = 0; // Starts at 0, increases when games are completed
const feedButton = document.getElementById("feed");
feedButton.textContent = `Feed x${feedX}`; // Button starts at Feed x0

feedButton.addEventListener("click", function () {
    if (feedX === 0) {
        console.log("No more food left!");
        feedButton.disabled = true;
        return;
    }

    feedX = Math.max(feedX - 1, 0);
    console.log("Remaining food:", feedX);
    feedButton.textContent = `Feed x${feedX}`;

    if (statusLevel < maxStatus) {
        statusLevel += increaseAmount;
        if (statusLevel > maxStatus) {
            statusLevel = maxStatus;
        }
        document.getElementById("statusBar").style.width = statusLevel + "%";

        // Show hearts GIF on every press (if statusLevel is below maxStatus)
        const hearts = document.getElementById("hearts");
        hearts.style.display = "block"; // Show hearts
        setTimeout(function () {
            hearts.style.display = "none"; // Hide after 1 second
        }, 1000);
    }

    // Play the sound when the feed button is clicked
    const audio = new Audio('wheelgame/nomnom.mp3');
    audio.play();

    if (feedX === 0) {
        feedButton.disabled = true;
    }

    // If status reaches max (third feed), trigger evolution
    if (statusLevel >= maxStatus) {
        evolveCharacter();
    }
});

// Function to mark the game as completed
function markGameCompleted() {
    console.log("markGameCompleted() called!"); // Debugging
    feedX = Math.min(feedX + 1, 3); // Max 3 feeds
    feedButton.textContent = `Feed x${feedX}`;
    feedButton.disabled = false; // Enable button since we have food

    console.log(`Game completed. Feed count is now: ${feedX}`);
}

// Function to handle evolution
function evolveCharacter() {
    console.log("Evolution triggered!");

    const shapeElement = document.querySelector(".shape");
    if (shapeElement) {
        shapeElement.remove(); // Remove the existing shape
    }

    const EVO = [
        "resources/EVO1.gif",
        "resources/EVO2.gif",
        "resources/EVO3.gif",
        "resources/EVO4.gif",
        "resources/EVO5.gif",
        "resources/EVO6.gif",
        "resources/EVO7.gif",
    ];

    const randomIndex = Math.floor(Math.random() * EVO.length);
    const evoElement = document.createElement("img");
    evoElement.src = EVO[randomIndex];
    evoElement.classList.add("evolved"); // Add class for styling
    document.body.appendChild(evoElement);

    const evolveSound = new Audio('wheelgame/winsquare-6993.mp3');
    evolveSound.play();

    console.log("EVO Image Created:", evoElement);
}
