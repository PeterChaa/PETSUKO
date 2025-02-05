(function () {
  const petNames = [
    "Fluffy", "Lord Azazel of the Dark Arts", "Max", "Luna", "Charlie", "Milo",
    "Coco", "Rocky", "Buddy", "Shadow", "Daisy", "Ginger", 
    "Hector", "Salty", "Gramps", "Peter", "Asher", "Ashley",
    "Astor", "Waffle", "Harriot", "Crepe", "Waster", "Bubbles", "Nibbles",
    "Mochi", "Sprout", "Peanut", "Jasper", "Pickles", "Biscuit", "Bo Mingle", "Jimmy", "Ryan",
    "Gianne", "Lebron", "Goonsicle", "Shin", "Kwon", "Piddle", "Paco", "Bella",
    "Bacon", "John", "Josh", "Kevin", "Dexter", "Morgan", "Fish", "Rita", "Deb", "Angel", "Masuka",
    "Kay", "Kai", "DJ", "PJ", "Berry", "Shoko", "Squirt", "Chud", "Goobert", "Chopper", "Monkey", 
    "Luffy", "Kurt", "Cobain", "Janet", "Jennie", "Jared", "Jack", "Reid", "Gustav", "Robert", 
    "Anthony", "Alvin", "Jake", "James", "Patrick", "Zed", "Zach", "Pikachu", "Sam", "Kathrine", "Madyline",
    "Katie", "Oliver", "Mia", "Opal", "Cooper", "Rex", "Roxie", "Elvis", "Edward", "Matt", "Kathy", "Heidi",
    "Cha", "Hazel", "Skye", "Pearl", "Oreo", "Hani", "Juno", "Jane", "Many", "Churro", "Thor", "Nugget",
    "Kiwi", "Thunder", "Nemo", "Rocket", "Tommy", "Tom", "Bear", "Cotton", "Pixel", "Richard", "Tristan",
    "Vincent", "Trevor", "Dracula", "Blood", "Boy", "Krastos The God of War", "Bloof", "Blarf", "Atlas",
    "Glorg", "Klock", "Platica", "Lalo", "Saul", "Kim", "Heisenberg", "Tony", "Stark",
    "Crystal Williams", "Plink", "Kirby", "Kazuya", "Mishima", "Falcon", "Todo", "The Honored One", "Akira",
    "Hakari", "Jesse", "Jess", "Jessica", "Ali", "Aki", "AJ", "Alex", "Yoobeans", "Aoi", "Chika", "Hanzō",
    "David", "Carlos", "Hugo", "Camila", "Luis", "Diego", "Kazayuki", "Bingo", "Bing", "Henry", "Glue",
    "Gleppy", "Dleapy", "Slorg", "Sleepy", ";)", "Hazey", "<3", "Apex", "Predator", "Alien", "⎍⟟⎎⍜⎍⟒⍙",
    "Dumpling", "Hellspawn", "Erin", "Abraham", "Washington", "Isaac", "Cain", "Adam", "Eve", "King",
    "The Black Swordsman", "Guts", "Trout", "Trunks", "Goku", "Duck", "Harpy", "Gyro", "Christian",
    "Chris", "Orion", "Tyler", "Lucas", "Lukas", "Ral", "Jace", "Andrew", "Noah", "Daft", "Punk",
    "JoJo", "Golden Requiem", "Sage", "MF DOOM", "SZA", "Jett", "Omen", "Phoenix", "Breach", "Brimstone",
    "Venom", "Frost", "Moonknight", "Daryl", "Rick", "Negan", "Glenn", "Harvey", "Steve", "Creeper",
    "Captain Sparklez", "Tarnished", "Forsaken", "Cayde-6", "Guardian", "Coach", "Nick", "Rochelle", "Ellis",
    "Bubblegum", "Peanut the Great", "Rust", "Counter Strike", "Smokey", "Shadow", "Fred", "Pumpkin", "Sunny",
    "Marshmallow", "Socks", "Bolt", "Breezy", "Misty", "Patches", "Ginger", "Cocoa", "Chubby", "Speckles",
    "Mocha", "Macha", "Latte", "Vanilla", "Leatherface", "Liquid Death", "Yeonjae",
  ];

  let userTyped = false;

  function generateName() {
    const randomName = petNames[Math.floor(Math.random() * petNames.length)];
    document.getElementById("petname").value = randomName;
    sessionStorage.setItem("petName", randomName);
    sessionStorage.setItem("userTyped", "false");
    userTyped = false;
  }

  document.addEventListener("DOMContentLoaded", function () {
    const generateButton = document.getElementById("button");
    const petNameInput = document.getElementById("petname");
    const startButton = document.querySelector(".button2");

    if (generateButton) {
      generateButton.addEventListener("click", generateName);
    }

    if (petNameInput) {
      petNameInput.addEventListener("input", function () {
        userTyped = true;
        sessionStorage.setItem("userTyped", "true");
      });
    }

    if (startButton) {
      startButton.addEventListener("click", function () {
        const currentName = petNameInput.value.trim();
        if (currentName) {
          sessionStorage.setItem("petName", currentName);
        }
        console.log("Stored pet name:", sessionStorage.getItem("petName"));
        console.log("User typed:", sessionStorage.getItem("userTyped"));
      });
    }
  });
})();
