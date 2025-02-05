document.addEventListener("DOMContentLoaded", function () {
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    canvas.width = windowWidth * 0.7;  
    canvas.height = windowHeight * 0.7; 
    canvas.style.position = "absolute";
    canvas.style.top = (windowHeight - canvas.height) / 2 + "px";  
    canvas.style.left = (windowWidth - canvas.width) / 2 + "px"; 
    canvas.style.zIndex = "-1";

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
    document.body.appendChild(imageElement);

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
    document.body.appendChild(imageElement2);

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
    document.body.appendChild(imageElement3);
    
    console.log("EVO Image Created:", imageElement3);
    






    // Create a background rectangle instead of bgDiv
    const bgRect = document.createElement("div");
    bgRect.style.position = "absolute";
    document.body.appendChild(bgRect);

    // Set the background color only once
    const bgColor = getRandomColor();
    bgRect.style.backgroundColor = bgColor;

    // Update background position and size dynamically
    function updateBackground() {
        const rect = imageElement.getBoundingClientRect();
        const shapeRect = imageElement2.getBoundingClientRect();

        // Find the combined area that covers both the face and the shape
        const minLeft = Math.min(rect.left, shapeRect.left);
        const minTop = Math.min(rect.top, shapeRect.top);
        const maxRight = Math.max(rect.right, shapeRect.right);
        const maxBottom = Math.max(rect.bottom, shapeRect.bottom);

        const width = maxRight - minLeft;
        const height = maxBottom - minTop;

        // Position and size the background rectangle
        bgRect.style.top = minTop + "px";
        bgRect.style.left = minLeft + "px";
        bgRect.style.width = width + "px";
        bgRect.style.height = height + "px";
        bgRect.style.zIndex = "0"; // Make sure it's at the bottom
    }

    // Call updateBackground on images load
    imageElement.onload = updateBackground;
    imageElement2.onload = updateBackground;

    // Recalculate on window resize
    window.addEventListener('resize', updateBackground);
});
