let module = require("./answers.js")

let answers = module.answers;
let validGuesses = module.validGuesses;


let gameState = 0;
let inputValid = true;
let lettersTyped = 0;
let wordsSubmitted = 0;
let settingsMenuOpen = false;
let currentMode = "challenge";
let score = 0;
let guess = "";
let guessedRight = [false, false, false, false, false];
let board = [[], [], [], [], []];
let bombs = ["", "", "", "", ""];
let yellowLetters = [];
let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let laserHeight = 6;
let boardHeight = 0;
let level = 0;
let laserSpeed = 1;


let answer = answers[Math.floor(Math.random() * answers.length)].toUpperCase();
function newWord() {
  answer = answers[Math.floor(Math.random() * answers.length)].toUpperCase();
  // console.log(answer);
}
// console.log(answer);

function submitWord() {
  if (
    (lettersTyped == 5 && answers.includes(guess.toLowerCase())) ||
    (validGuesses.includes(guess.toLowerCase()) && settingsMenuOpen == false)
  ) {
    if (gameState == 0 && currentMode == "challenge") {
      gameState = 1;
      document.querySelectorAll("h1")[0].classList.add("fade");
    }
    inputValid = false;
    confirmCorrectLetters();
    colorIncorrectGuesses();
    addLetterIdsToArray();
    matchBoardToArray();
    lettersTyped = 0;
    wordsSubmitted++;
    checkAnswer();
    checkBombs();
    if (currentMode == "challenge") {
      checkDeath();
    }
    guess = "";
  }
  setTimeout(() => {
    inputValid = true;
  }, 100);
}

function confirmCorrectLetters() {
  for (let i = 0; i < 5; i++) {
    let letter = document.getElementById(`letter${wordsSubmitted * 5 + i}`);
    if (letter.innerHTML == answer[i]) {
      letter.classList.add("correct-letter");
      if (guessedRight[i]) {
        setTimeout(() => {
          removeLetter(letter);
        }, 500);
      } else {
        laserHeight = laserHeight + 0.25;
      }
      let key = document.getElementById(letter.innerHTML);
      key.classList.add("correct");
      guessedRight[i] = true;
    }
  }
}

function removeLetter(letter) {
  letter.classList.add("vanish");
  for (let i = 0; i < 5; i++) {
    board[i] = board[i].filter((x) => x !== letter.id);
  }
  setTimeout(() => {
    letter.remove();
  }, 500);
}

function colorIncorrectGuesses() {
  for (let i = 0; i < 5; i++) {
    let letter = document.getElementById(`letter${wordsSubmitted * 5 + i}`);
    let key = document.getElementById(letter.innerHTML);
    if (letter.innerHTML != answer[i]) {
      if (answer.includes(letter.innerHTML)) {
        letter.classList.add("nearly");
        key.classList.add("nearly");
        yellowLetters.push[letter.id];
      } else {
        letter.classList.add("wrong");
        key.classList.add("wrong-key");
      }
    }
  }
}

function addLetterIdsToArray() {
  for (let i = 0; i < 5; i++) {
    let letter = document.getElementById(`letter${wordsSubmitted * 5 + i}`);
    if (letter.innerHTML != answer[i]) {
      board[i].unshift(letter.id);
    }
  }
}
function matchBoardToArray() {
  boardHeight = 0;
  for (let i in board) {
    for (let j in board[i]) {
      let letter = document.getElementById(board[i][j]);
      let height = (parseInt(j) + 2) * -1.2;
      if (letter) {
        letter.style.transform = `translateY(calc(var(--tile-size) * ${height}))`;
      }
    }
    if (boardHeight < board[i].length) {
      boardHeight = board[i].length;
    }
  }
}

function checkAnswer() {
  if (!guessedRight.includes(false)) {
    addWordToArray();
    celebrate();
    setTimeout(() => {
      removeAllColors();
      guessedRight = [false, false, false, false, false];
      animateField();
      newWord();
      setTimeout(() => {
        getNewColors();
        matchBoardToArray();
      }, 500);
    }, 1000);
  }
}

function addWordToArray() {
  for (let i = 0; i < 5; i++) {
    let col = document.getElementById(`col${i}`);
    let correct = col.querySelectorAll(".correct-letter:not(.vanish)")[0];
    board[i].unshift(correct.id);
  }
}

function celebrate() {
  laserHeight = laserHeight + 1.5;
  for (let i = 0; i < 5; i++) {
    let col = document.getElementById(`col${i}`);
    let correct = col.querySelectorAll(".correct-letter:not(.vanish)")[0];
    let yellows = col.querySelectorAll(".nearly");
    for (let j = 0; j < yellows.length; j++) {
      removeLetter(yellows[j]);
    }
    matchBoardToArray();
    setTimeout(() => {
      correct.classList.add("sparkle");
    }, i * 70);
  }
  level++;
  if (level % 3 == 0) {
    levelUp();
  }
  score += 10;
  document.getElementById("score").className = "score";
  document.getElementById("score").offsetWidth;
  document.getElementById("score").className = "score green-score";
  document.getElementById("score").innerHTML = `score: ${score}`;
  document.getElementById("gameOverScore").innerHTML = `score: ${score}`;
}

let backgroundNumber = 0;
let backgroundColors = [
  "lightgreen",
  "lightblue",
  "indigo",
  "orange",
  "green",
  "blue",
  "purple",
  "red",
  "yellow"
];

function levelUp() {
  laserSpeed++;
  document.getElementById("gameboard").classList.remove("gameboard-color");
  document.documentElement.style.setProperty(
    "--background-color",
    backgroundColors[backgroundNumber % backgroundColors.length]
  );
  document.getElementById("gameboard").classList.offsetWidth;
  document.getElementById("gameboard").classList.add("gameboard-color");
  backgroundNumber++;
}

function removeAllColors() {
  let letters = document.querySelectorAll(".letter");
  for (let i in letters) {
    letters[i].classList = "letter wrong";
  }
  for (let i in alphabet) {
    document
      .getElementById(alphabet[i])
      .classList.remove("wrong-key", "nearly", "correct");
  }
}

function animateField() {
  document.querySelectorAll(".field").forEach((e) => (e.className = "field"));
  document.querySelectorAll(".field").forEach((e) => e.offsetWidth);
  document
    .querySelectorAll(".field")
    .forEach((e) => (e.className = "field field-animate"));
}

function getNewColors() {
  for (let i = 0; i < 5; i++) {
    //     iterate through the sub-array backwards
    let guessed = false;
    for (let j = board[i].length - 1; j >= 0; j--) {
      let letter = document.getElementById(board[i][j]);
      if (guessed) {
        removeLetter(document.getElementById(board[i][j]));
      } else if (answer[i] == letter.innerHTML) {
        guessed = true;
        guessedRight[i] = true;
        document.getElementById(board[i][j]).classList.add("correct-letter");
        document.getElementById(letter.innerHTML).classList.add("correct");
        board[i] = board[i].filter((x) => x !== letter.id);
      } else if (
        document.getElementById(board[i][j]) &&
        answer.includes(letter.innerHTML)
      ) {
        document.getElementById(board[i][j]).classList.add("nearly");
        document.getElementById(letter.innerHTML).classList.add("nearly");
      } else {
        document.getElementById(letter.innerHTML).classList.add("wrong-key");
      }
    }
  }
}

function checkBombs() {
  for (let i = 0; i < 5; i++) {
    if (guess[i] == bombs[i]) {
      laserHeight = laserHeight + 1.25;
      explode(i);
      for (let j = board[i].length - 1; j >= 0; j--) {
        let letter = document.getElementById(board[i][j]);
        removeLetter(letter);
        document.getElementById(`bomb${i}`).classList.remove("bomb");
        document.getElementById(`bomb${i}`).innerHTML = "";
        bombs[i] = "";
      }
    }
  }
}
function explode(col) {
  let column = document.getElementById(`col${col}`);
  column.classList.remove("bomb-animate");
  column.offsetWidth;
  column.classList.add("bomb-animate");
}

function checkDeath() {
  if (laserHeight <= boardHeight) {
    document.getElementById("gameover").style.display = "block";
    document.getElementById("wordReveal").innerHTML = answer;
    gameState = 3;
  }
}

function addLetter(input) {
  if (lettersTyped < 5 && gameState <= 1 && inputValid) {
    let letter = input.toUpperCase();
    let col = document.getElementById("col" + lettersTyped);
    let tile = document.createElement("div");
    tile.className = "letter";
    tile.id = `letter${wordsSubmitted * 5 + lettersTyped}`;
    tile.innerHTML = letter;
    col.appendChild(tile);
    guess += letter.toUpperCase();
    lettersTyped++;
    //     TODO set color to red and add horizontal shake if lettersTyped = 5 && guess is not in validGuesses
  }
}
function deleteLetter() {
  if (lettersTyped > 0) {
    document
      .getElementById(`letter${wordsSubmitted * 5 + lettersTyped - 1}`)
      .remove();
    guess = guess.slice(0, -1);
    lettersTyped--;
  }
}

function laserDrop() {
  if (gameState == 1) {
    laserHeight = laserHeight - 0.01;
    document.documentElement.style.setProperty("--laser-progress", laserHeight);
    checkDeath();
  }
}
let laserdrop = setInterval(laserDrop, 500 / Math.sqrt(laserSpeed));

function warningCol() {
  if(currentMode == "challenge"){
  for (let i = 0; i < 5; i++) {
    if (board[i].length > laserHeight - 0.5) {
      document.getElementById(`col${i}`).classList.add("warn");
      setTimeout(() => {
        document.getElementById(`col${i}`).classList.remove("warn");
      }, 1000);
    }
  }
}
}

let warningcol = setInterval(warningCol, 1500);

function getBomb() {
  if (gameState == 1) {
    for (let i = 0; i < 5; i++) {
      if (bombs[i] == "") {
        let distance = laserHeight - board[i].length;
        let bombChance = board[i].length / (50 * (distance + 1));
        let gettingBomb = Math.random() < bombChance;
        if (gettingBomb) {
          let letter = alphabet[Math.floor(Math.random() * alphabet.length)];
          bombs[i] = letter;
          document.getElementById(`bomb${i}`).classList.add("bomb");
          document.getElementById(`bomb${i}`).innerHTML = letter;
          setTimeout(() => {
            document.getElementById(`bomb${i}`).classList.remove("bomb");
            document.getElementById(`bomb${i}`).innerHTML = "";
            bombs[i] = "";
          }, 14000);
        }
      }
    }
  }
}

let getbomb = setInterval(getBomb, 3000);

function reset() {
  gameState = 0;
  lettersTyped = 0;
  wordsSubmitted = 0;
  score = 0;
  document.getElementById("score").innerHTML = `score: ${score}`;
  document.getElementById("gameOverScore").innerHTML = `score: ${score}`;
  document.getElementById("settings").style.display = "block";
  guess = "";
  guessedRight = [false, false, false, false, false];
  newWord();
  columnHeight = [0, 0, 0, 0, 0];
  board = [[], [], [], [], []];
  laserHeight = 6;
  document.documentElement.style.setProperty("--laser-progress", laserHeight);
  laserSpeed = 1;
  document.getElementById("gameover").style.display = "none";
  document.querySelectorAll(".letter").forEach((e) => e.remove());
  for (let i = 0; i < 5; i++) {
    document.getElementById(`bomb${i}`).classList.remove("bomb");
    document.getElementById(`bomb${i}`).innerHTML = "";
    bombs[i] = "";
  }
  for (let i in alphabet) {
    document
      .getElementById(alphabet[i])
      .classList.remove("wrong-key", "nearly", "correct");
  }
}

window.addEventListener(
  "keyup",
  function (e) {
    if (alphabet.includes(e.key.toUpperCase())) {
      addLetter(e.key);
    }
    if (event.keyCode === 13) {
      submitWord();
    }
    if (event.keyCode === 8) {
      deleteLetter();
    }
  },
  false
);

function toggleSettings() {
  settingsMenuOpen = !settingsMenuOpen;
  if (settingsMenuOpen) {
    document.getElementById("menu").style.display = "block";
  } else {
    document.getElementById("menu").style.display = "none";
  }
  
}
function neutralClick(){
  settingsMenuOpen = false;
  
    document.getElementById("menu").style.display = "none";
}

function setPracticeMode() {
  currentMode = "practice";
  document.getElementById("practice").classList.add("active");
  document.getElementById("challenge").classList.remove("active");
  document.getElementById("laser").style.opacity = "0";
  document.getElementById("score").style.opacity = "0";
  reset();
}

function setChallengeMode() {
  currentMode = "challenge";
  document.getElementById("challenge").classList.add("active");
  document.getElementById("practice").classList.remove("active");
  document.getElementById("score").style.opacity = "1";
  document.getElementById("laser").style.opacity = "1";
  reset();
}

function onClick(event) {
  if (alphabet.includes(event.srcElement.id) && event.srcElement.id != "") {
    addLetter(event.srcElement.id);
  } 
  else if (event.srcElement.id == "enter") {
    submitWord();
  }
  else if (event.srcElement.id == "del") {
    deleteLetter();
  }
  else if (event.srcElement.id == "settings") {
    toggleSettings();
  }
  else if (event.srcElement.id == "practice") {
    setPracticeMode();
  }
  else if (event.srcElement.id == "challenge") {
    setChallengeMode();
  }
  else{
    neutralClick();
  }
}


window.addEventListener("click", onClick);
window.addEventListener("touchstart", onClick);

