document.addEventListener("DOMContentLoaded", function () {
    const gameFrame = document.getElementById("gameFrame");

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    document.getElementById("petColorBg").style.backgroundColor = getRandomColor();

    const faces = [
        "resources/cute face.png",
        "resources/derp face.png",
        "resources/FACEE.png",
        "resources/scared face.png",
        "resources/smile.png",
        "resources/hi.png",
        "resources/baby.png",
        "resources/smile1.png",
        "resources/eye.png",
        "resources/sunglasses.png",
        "resources/openmouth.gif",
    ];

    const randomIndex = Math.floor(Math.random() * faces.length);
    const imageElement = document.createElement("img");
    imageElement.src = faces[randomIndex];
    imageElement.classList.add("character"); // Add class to apply CSS
    gameFrame.appendChild(imageElement);

    console.log("Image Element Created:", imageElement); // Debugging

    const shapes = [
        "resources/node!.gif",
        "resources/robot.gif",
        "resources/starrr.gif",
        "resources/square.gif",
        "resources/triangle.gif",
        "resources/slimmeeee.gif",
        "resources/heartshape.gif",
        "resources/pill.gif",
        "resources/diamond.gif",
        "resources/hatman!.gif",
        "resources/star.gif",
        "resources/flower.gif",
        "resources/101.gif",
    ];

    const randomIndex2 = Math.floor(Math.random() * shapes.length);
    const imageElement2 = document.createElement("img");
    imageElement2.src = shapes[randomIndex2];
    imageElement2.classList.add("shape"); // Add class for styling
    gameFrame.appendChild(imageElement2);

    console.log("Shape Image Created:", imageElement2); // Debugging


    const EVO = [
        "resources/EVO1.gif",
        "resources/EVO2.gif",
        "resources/EVO3.gif",
        "resources/EVO4.gif",
        "resources/EVO5.gif",
        "resources/EVO6.gif",
        "resources/EVO7.gif",
    ];

    const randomIndex3 = Math.floor(Math.random() * EVO.length); // Use correct EVO length
    const imageElement3 = document.createElement("img");
    imageElement3.src = EVO[randomIndex3]; // Set the correct EVO image
    imageElement3.classList.add("evolved"); // Assign a unique class
    imageElement3.style.display = "none"; // Start hidden, show it later
    gameFrame.appendChild(imageElement3);

    console.log("EVO Image Created:", imageElement3);
});
