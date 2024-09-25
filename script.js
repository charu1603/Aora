let boardSize;
let playerOneSymbol;
let playerTwoSymbol;
let currentPlayer;
let board;
let gameOver;
var count = 200;
var defaults = {
  origin: { y: 0.7 }
};

// Initialize confetti firing function
function fire(particleRatio, opts) {
  confetti({
    ...defaults,
    ...opts,
    particleCount: Math.floor(count * particleRatio)
  });
}

function initializeGame() {
    // Get user input for custom settings
    boardSize = parseInt(document.getElementById("boardSize").value);
    playerOneSymbol = document.getElementById("playerOneSymbol").value || "X";
    playerTwoSymbol = document.getElementById("playerTwoSymbol").value || "O";

    // Set current player to player 1 initially
    currentPlayer = playerOneSymbol;
    gameOver = false;

    // Create the board as a 2D array
    board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));

    // Draw the board UI
    drawBoard();
    updateMessage(`Player ${currentPlayer}'s turn`);
}

function drawBoard() {
    const boardElement = document.getElementById("board");
    boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    boardElement.innerHTML = ""; // Clear previous board

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener("click", handleCellClick);
            boardElement.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;

    // Check if the cell is already occupied or the game is over
    if (board[row][col] || gameOver) {
        return;
    }

    // Update board and UI
    board[row][col] = currentPlayer;
    event.target.textContent = currentPlayer;

    // Check for win or draw after placing the symbol
    if (checkWin(row, col)) {
        updateMessage(`Player ${currentPlayer} wins!`);
        gameOver = true;
        triggerConfetti(); // Trigger confetti when a player wins
    } else if (checkDraw()) {
        updateMessage("It's a draw!");
        gameOver = true;
    } else {
        // Switch to the next player
        currentPlayer = currentPlayer === playerOneSymbol ? playerTwoSymbol : playerOneSymbol;
        updateMessage(`Player ${currentPlayer}'s turn`);
    }
}

function checkWin(row, col) {
    row = parseInt(row);
    col = parseInt(col);

    // Check row
    if (board[row].every(cell => cell === currentPlayer)) {
        return true;
    }

    // Check column
    if (board.every(row => row[col] === currentPlayer)) {
        return true;
    }

    // Check diagonal (top-left to bottom-right)
    if (row === col && board.every((_, i) => board[i][i] === currentPlayer)) {
        return true;
    }

    // Check anti-diagonal (top-right to bottom-left)
    if (row + col === boardSize - 1 &&
        board.every((_, i) => board[i][boardSize - 1 - i] === currentPlayer)) {
        return true;
    }

    return false;
}

function checkDraw() {
    // If no empty cells are left, it’s a draw
    return board.every(row => row.every(cell => cell !== null));
}

function updateMessage(message) {
    const messageElement = document.getElementById("message");
    messageElement.textContent = message;

    // Set message color to white
    messageElement.style.color = "white";
}

function resetGame() {
    // Resets the game state and board
    initializeGame();
}

function triggerConfetti(message) {
    const confettiContainer = document.getElementById("confetti");
    const winMessageElement = document.getElementById("winMessage");
    const winSound = document.getElementById("winSound");

    // Show the winning message
    winMessageElement.textContent = message;

    // Play the sound
    winSound.currentTime = 0; // Rewind to the start
    winSound.play(); // Play the sound

    // Fire confetti
    fire(0.25, {
        spread: 26,
        startVelocity: 55,
        element: confettiContainer,
    });
    fire(0.2, {
        spread: 60,
        element: confettiContainer,
    });
    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
        element: confettiContainer,
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
        element: confettiContainer,
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 45,
        element: confettiContainer,
    });

    // Optional: Hide the message after a few seconds
    setTimeout(() => {
        winMessageElement.textContent = ''; // Clear the message
    }, 5000); // Hide after 5 seconds
}



// Initialize default game when the page loads
window.onload = initializeGame;
