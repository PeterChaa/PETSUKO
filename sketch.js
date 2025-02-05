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
  "Anthony", "Alvin", "Jake", "James", "Patrick", "Zed", "Zach", "Pikacku", "Sam", "Kathrine", "Madyline",
  "Katie", "Oliver", "Mia", "Cooper", "Rex", "Roxie", "Elvis", "Edward", "Matt", "Kathy", "Heidi",
  "Cha", "Hazel", "Skye", "Pearl", "Oreo", "Hani", "Juno", "Jane", "Many", "Churro", "Thor", "Nugget",
  "Kiwi", "Thunder", "Nemo", "Rocket", "Tommy", "Tom", "Bear", "Cotton", "Pixel", "Richard", "Tristan",
  "Vincent", "Trevor", "Dracula", "Blood", "Boy", "Kratos The God of War", "Bloof", "Blarf", "Atlas",
  "Glorg", "Klock", "Platica", "Lalo", "Saul", "Kim", "Heisenberg", "Tony", "Stark",
  "Crystal Williams", "Plink", "Kirby", "Kazyua", "Mishima", "Falcon", "Todo", "The Honored One", "Akira",
  "Hakari", "Jesse", "Jess", "Jessica", "Ali", "Aki", "AJ", "Alex", "Yoobeans", "Aoi", "Chika", "Hanzō",
  "David", "Carlos", "Hugo", "Camila", "Luis", "Diego", "Kazayuki", "Bingo", "Bing","Henry", "Glue",
  "Gleppy", "Dleapy", "Slorg", "Sleepy", ";)", "Hazey", "<3", "Apex", "Predator", "Alien", "⎍⟟⎎⍜⎍⟒⍙",
  "Dumpling", "Hellspawn", "Erin", "Abraham", "Washington", "Issac", "Cain", "Adam", "Eve", "King",
  "The Black Swordsman", "Guts", "Trout", "Trunks", "Goku", "Duck", "Harpy", "Gyro", "Christan",
  'Chris', "Orion", "Tyler", "Lucas", "Lukas", "Ral", "Jace", "Andrew", "Noah", "Daft", "Punk",
  "Amos", "Ella", "Lily", "Chloe", "Ellie", "Harper", "Eathan", "Mike", "Owen", "Baby", "Sonic",
  "Knuckles", "Tails", "Mario", "Amy", "Eggman", "Egg", "Blecky", "Busted", "Nut", "Shampoo",
  "Rog", "Kewpi", "Mayo", "Bird", "Blurd", "Banana", "Hat", "Artic", "Strawhat", "Flamingo",
  "Don Quixote", "Damnation", "Purge", "Apocolypse", "Bojack", "Go Halibut", "Sun", "Usopp", "Zoro",
  "Sanji", "Nami", "Robin", "Robyn", "Cat", "Pet", "PetCha", "Leo", "Winnie", "Pooh", "Poof",
  "Cosmo", "Wando", "Butters", "Cartman", "Kyle", "Stan", "Em", "Tolkien", "Griffin", "Stewie", "Brian",
  "Lois", "Meg", "Megatron", "Joe", "Cleveland", "Quagmire", "Zuko", "Mark", "Azula", "Avatar",
  "Katara", "Miffy", "Smiski", "Ghost", "Soap", "Price", "Dice", "Ace", "Pocket", "Baddie", "Rainbow",
  "Drop", "Cooler", "Flush", "Full House", "Raise", "Stand", "JoJo", "River", "Bluff", "Golden Requiem"<
  "Sage", "MF DOOM", "Sza", "Jett", "Omen", "Pheonix", "Breach", "Brimstone", "Psylocke", "Racoon",
  "Venom", "Frost", "Moonnight", "Daryl", "Rick", "Negan", "Glen", "Harvey", "Steve", "Creeper",
  "Captain Sparklez", "Hoover", "Taft", "JFK", "Theodore", "Kennedy", "Leon", "Ada", "Tarnished",
  "Forsaken", "Cayde-6", "Guardian", "Coach", "Nick", "Rochelle", "Ellis", "Eric", "Eye of Cythulu", "Enderman",
  "Silverfish", "Mahi-Mahi", "Sock-Eye", "Salmon", "Piese", "Denji", "Hamster", "Finn", "Bubblegum",
  "Newjeans", "Bunnie", "Pibble", "Pebble", "Fruity", "Zesty", "Bubblebass", "Sugoi", "Power",
  "Berry", "Perry", "Ladybug", "Princess", "Cupcake", "Meow", "Kitty", "Whiskers", "Coffee", "Bob",
  "Peach", "Eggshell", "Toast", "Teal", "Charcoal", "Lobster", "Brick","Shanks", "Doramon", "Squid",
  "Floyd", "Prince", "Admiral Sniffington", "Beettlejuice", "Butterball", "Bartholomew", "Archduke Fritzi III",
  "Rose", "Cherri", "Butterfinger", "Sardine", "Rango", "Duchess Kate Middleton", "Chocolate Chip Cookie",
  "Huckleberry", "Jabberwocky", "Anakin", "Luke", "Fauntleroy", "Vesuvius Firestorm", "Snowflake",
  "FenrirTheFierce", "Prometheus", "Cerbrus", "Loki", "Odysseus","Helios","Zeus","Freya", "Athena", 
  "Apollo", "Creed", "Godfather", "Thorfinn", "Mikasa", "Eren", "Armin", "Jay Gatsby", "Woofgang Puck", "Puck",
  "Kanine West", "Miku", "Zephyr", "Wizard", "Poptart", "Darwin", "Pesto", "Melon", "Klondike", "Soba",
  "Sans", "Papayrus", "Patrick Bateman", "Coal", "Cheddar", "Cole", "Cassidy", "Led", "Zepplin", "Chimp",
  "Sublime","Ruby", "Q-Tip", "Ice Cube", "Toji", "Gojo", "Suguru", "Yuji", "Megumi", "Radio", "Candy Claws",
  "Flying Fish", "Blackjack", "Kramer", "Coco", "Buddy", "Yogi", "Fudge", "Buckeye", "Stitch", "Spanky",
  "Dio", "Linus", "Scooby", "Cipher", "Cyrus", "Cyrax", "Smoke", "Bengal", "Sub-Zero", "Scorpion",
  "Liu Kang", "Jax", "Cage", "Apple", "Pandora", "Bond", "Alucard", "Gandalf", "Aragorn", "Lara", "Elsa",
  "Greg Heffey", "Frodo", "Saruron", "Robinhood", "Nicolas Larson","Zit","Zitface", "Laundry", "Gator Trail", "Death", "Tulip",
  "Turnip", "Tom Nook", "Issabelle", "Cloft", "Clove", "Aemin", "White Death", "Doom Slayer", "Tom Sawyer", "Cape Crusaider", "Joker", "Saint",
  "Lauryn", "Apriocot", "Pecan", "Walnut", "Cashew", "Duckie", "Tide", "Pulp", "Ghangis", "Mihawk",
  "Aquaphor", "Nokia", "Lithium", "Baba Yaga", "Table Tennis", "BMO", "Headlock", "Bjork", "Justin",
  "Sabrina", "Peanut the Great", "Jo Cringle son of Bo Mingle", "Rust", "Counter Strike", "Striker",
  "Spot", "Stripes", "Mermaid", "Smokey", "Shadow", "Fred", "Pumpkin", "Sunny", "Marshmellow", "Tabitha", "Socks", "Bolt",
  "Breezy", "Misty", "Patches", "petah", "ustink", "Ginger", "Gozer", "Cocoa", "Chubby", "Speckles", "Mack", "Spud", "Willie",
  "Spooky", "Chip", "Mocha", "Macha", "Latte", "✧˖°", "Fein", "Petsuko Lover!", "Cake", "Vanilla", "Leatherface", "Liquid Death",
];

let userTyped = false;

function generateName() {
  const randomName = petNames[Math.floor(Math.random() * petNames.length)];
  document.getElementById("petname").value = randomName;

  sessionStorage.setItem("petName", randomName);
  sessionStorage.setItem("userTyped", "false"); // Mark as system-generated
  userTyped = false;
}

document.getElementById("button").addEventListener("click", generateName);

// Detect manual input
document.getElementById("petname").addEventListener("input", function () {
  userTyped = true;
  sessionStorage.setItem("userTyped", "true"); // Mark as user-typed
});

document.querySelector(".button2").addEventListener("click", function () {
  const currentName = document.getElementById("petname").value.trim();

  if (currentName) {
    sessionStorage.setItem("petName", currentName);
  }

  console.log("Stored pet name:", sessionStorage.getItem("petName"));
  console.log("User typed:", sessionStorage.getItem("userTyped"));
});
