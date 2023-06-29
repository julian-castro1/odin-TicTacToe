
// make display controller module
const displayController = (() => {
  // draw the symbol in the corresponding location
  const draw = (symbol, location) => {
    let file = symbol == "X" ? "background-image: url('X.svg');" : "background-image: url('O.svg');";
    console.log(location)
    location.setAttribute("style", file);
  };

  // clear the board
  const reset = () => {
    let inputSpots = document.querySelectorAll(".input-spot");

    inputSpots.forEach((inputSpot) => {
      if (inputSpot.hasAttribute("style")) {
        inputSpot.removeAttribute("style");
      }
    });
  };

  // clear the scores
  const reset_scores = () => {
    document.getElementById("p1-score").innerText = 0;
    document.getElementById("p2-score").innerText = 0;
  };

  // update the score
  const addWin = (player) => {
    let winner_score = player == 1 ? 'p1-score' : 'p2-score';
    
    document.getElementById(winner_score).innerText = parseInt(document.getElementById(winner_score).innerText) + 1;
  };

  // swap the symbols of the current players
  const swapSymbol = () => {
    let temp = document.getElementById("p1-marker").innerText;

    document.getElementById("p1-marker").innerText = document.getElementById("p2-marker").innerText;
    document.getElementById("p2-marker").innerText = temp;
  };

  const highlight = (player) => {
    let add = player == 1 ? "p1-name" : "p2-name";
    let remove = player == 1 ? "p2-name" : "p1-name";
    document.getElementById(add).style.border = "4px solid #4AC9FF";
    document.getElementById(remove).style.border = "0px";
  }

  // display game result
  const result = (player) => {
    if (player == "tie") {
        alert("Tie!");
    } else {
        addWin(player);
        if(player == 1){
            winner = document.getElementById("p1-name").value
        } else {
            winner = document.getElementById("p2-name").value
        }
        console.log(winner)
        if(winner == ""){ winner = "Player " + player; }
        alert(winner + " wins!");
    }


    
  };

  return { draw, reset, reset_scores, result, addWin, swapSymbol, highlight };
})();

// make game controller module
const gameController = (() => {
  let display = displayController;  // create the display controller
  let gameState = "setup";  // gameState is either setup, playing, or over
  let playerTurn = 1;       // playerTurn is either 1 or 2
  let p1_symbol = null;     // symbol of player 1
  let p2_symbol = null;     // symbol of player 2
  let turns = 0;            // number of turns played
  let gameBoard = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  // swap symbols
  const swap_symbols = () => {
    if(gameState != "playing"){
        display.swapSymbol();
    } else {
        alert("Cannot swap symbols while playing!");
    }
  };

  // reset everything, including scores
  const hard_reset = () => {
    reset();
    display.reset();
    display.reset_scores();
  }

  // check if a player has won
  const checkWin = () => {
    return checkVertical() || checkHorizontal() || checkDiagonal();
  };

  // begin the game, record and lock player symbols
  const begin = () => {
    // set gameState
    gameState = "playing";

    // set player symbols
    p1_symbol = document.getElementById("p1-marker").innerText;
    p2_symbol = document.getElementById("p2-marker").innerText;

    // set playerTurn based on symbols ('X' always goes first)
    p1_symbol == "X" ? (playerTurn = "1") : (playerTurn = "2");

    display.highlight(playerTurn)

  };

  // add a symbol to the board
  const play = (event) => {
    if (gameState != "playing") {
      alert("Please begin the game first.");
      return;
    }

    // display
    let curr_symbol = playerTurn == 1 ? p1_symbol : p2_symbol;
    display.draw(curr_symbol, event.target);

    // logic
    let row = parseInt(event.target.getAttribute("row"));
    let column = parseInt(event.target.getAttribute("column"));
    gameBoard[row][column] = curr_symbol;
    turns++;

    // check for win
    if (checkWin()) {
        setTimeout(() => {
          end(playerTurn);
        }, 10);
    } else {
        playerTurn == 1 ? playerTurn = 2 : playerTurn = 1;
    }

    // check for tie
    if (turns == 9)
      end('tie');

      // highlight next player
      display.highlight(playerTurn)

  };

  // reset game
  const reset = () => {
    if (gameState == 'reset'){return;}

    // add a delay before resetting
    setTimeout(display.reset(), 1000);
    gameState = "setup";
    playerTurn = "1";
    p1_symbol = null;
    p2_symbol = null;
    turns = 0;
    gameBoard = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
  };

  // end game
  const end = (winner) => {
    display.result(winner);
    reset();
  };

  // check vertical wins
  const checkVertical = () => {
    for (let i = 0; i < 3; i++) {
      if (gameBoard[0][i] && gameBoard[0][i] == gameBoard[1][i] && gameBoard[1][i] == gameBoard[2][i]) {
        return true;
      }
    }
    return false;
  };

  // check horizontal wins
  const checkHorizontal = () => {
    for (let i = 0; i < 3; i++) {
      if (gameBoard[i][0] && gameBoard[i][0] == gameBoard[i][1] && gameBoard[i][1] == gameBoard[i][2]) {
        return true;
      }
    }
    return false;
  };

  // check diagonal wins
  const checkDiagonal = () => {
    if (gameBoard[0][0] && gameBoard[0][0] == gameBoard[1][1] && gameBoard[1][1] == gameBoard[2][2]) {
      return gameBoard[0][0];
    } else if (gameBoard[0][2] && gameBoard[0][2] == gameBoard[1][1] && gameBoard[1][1] == gameBoard[2][0]) {
      return true;
    }
    return false;
  };

  // only need play, hard_reset, and begin to be exported
  return {
    checkWin,
    play,
    reset,
    hard_reset,
    swap_symbols,
    end,
    begin
  };
})();




/********* define flow **********/

// initiate controllers
let game = gameController;


// add event listeners
document.getElementById("play-button").addEventListener("click", game.begin);
document.getElementById("reset-button").addEventListener("click", game.hard_reset);
document.getElementById("swap-button").addEventListener("click", game.swap_symbols);
Array.from(document.getElementsByClassName("input-spot")).forEach(function (element) {
  element.addEventListener("click", game.play);
});