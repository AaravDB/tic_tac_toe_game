// ================== COMMON NAV ==================

function goToLocal() {
    window.location.href = "local.html";
}

function goToBot() {
    window.location.href = "bot.html";
}

function goHome() {
    window.location.href = "index.html";
}

const isLocalPage = window.location.pathname.includes("local.html");
const isBotPage = window.location.pathname.includes("bot.html");

// ================== COMMON WIN CHECK ==================

const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

function checkWinner(board) {
    for (let p of winPatterns) {
        const [a,b,c] = p;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

// ================== LOCAL MODE ==================

if (isLocalPage) {

let board, gameActive, gameNumber = 1;
let p1Score = 0, p2Score = 0, totalGames = 0;
let currentTurn;

const cells = document.querySelectorAll(".cell");
const turnIndicator = document.getElementById("turn-indicator");
const p1ScoreEl = document.getElementById("p1-score");
const p2ScoreEl = document.getElementById("p2-score");
const gamesCountEl = document.getElementById("games-count");

function startNewGame() {
    board = ["","","","","","","","",""];
    gameActive = true;

    let p1Symbol = (gameNumber % 2 === 1) ? "X" : "O";
    currentTurn = "X";

    turnIndicator.textContent = `Turn: ${currentTurn}`;
    cells.forEach(c => c.textContent = "");
}

function handleWin(symbol) {
    gameActive = false;
    totalGames++;

    let p1Symbol = (gameNumber % 2 === 1) ? "X" : "O";

    if (symbol === p1Symbol) p1Score++; else p2Score++;

    p1ScoreEl.textContent = p1Score;
    p2ScoreEl.textContent = p2Score;
    gamesCountEl.textContent = totalGames;

    gameNumber++;
    setTimeout(startNewGame, 800);
}

function handleDraw() {
    gameActive = false;
    totalGames++;
    gamesCountEl.textContent = totalGames;
    gameNumber++;
    setTimeout(startNewGame, 800);
}

cells.forEach(cell => {
    cell.addEventListener("click", () => {
        const i = cell.dataset.index;
        if (!gameActive || board[i]) return;

        board[i] = currentTurn;
        cell.textContent = currentTurn;

        let win = checkWinner(board);
        if (win) return handleWin(win);
        if (!board.includes("")) return handleDraw();

        currentTurn = currentTurn === "X" ? "O" : "X";
        turnIndicator.textContent = `Turn: ${currentTurn}`;
    });
});

document.getElementById("reset-btn").onclick = () => {
    p1Score = p2Score = totalGames = 0;
    gameNumber = 1;
    p1ScoreEl.textContent = p2ScoreEl.textContent = gamesCountEl.textContent = 0;
    startNewGame();
};

startNewGame();
}

// ================== BOT MODE ==================

if (isBotPage) {

let board, gameActive, gameNumber = 1;
let humanScore = 0, botScore = 0, totalGames = 0;
let currentTurn;

const cells = document.querySelectorAll(".cell");
const turnIndicator = document.getElementById("bot-turn-indicator");
const humanScoreEl = document.getElementById("human-score");
const botScoreEl = document.getElementById("bot-score");
const gamesCountEl = document.getElementById("bot-games-count");

function startBotGame() {
    board = ["","","","","","","","",""];
    gameActive = true;

    let humanSymbol = (gameNumber % 2 === 1) ? "X" : "O";
    let botSymbol = humanSymbol === "X" ? "O" : "X";

    currentTurn = "X";
    turnIndicator.textContent = `Turn: ${currentTurn}`;
    cells.forEach(c => c.textContent = "");

    if (currentTurn === botSymbol) setTimeout(botMove, 500);
}

function handleWin(symbol) {
    gameActive = false;
    totalGames++;

    let humanSymbol = (gameNumber % 2 === 1) ? "X" : "O";

    if (symbol === humanSymbol) humanScore++; else botScore++;

    humanScoreEl.textContent = humanScore;
    botScoreEl.textContent = botScore;
    gamesCountEl.textContent = totalGames;

    gameNumber++;
    setTimeout(startBotGame, 800);
}

function handleDraw() {
    gameActive = false;
    totalGames++;
    gamesCountEl.textContent = totalGames;
    gameNumber++;
    setTimeout(startBotGame, 800);
}

function botMove() {
    if (!gameActive) return;

    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            makeMove(i);
            break;
        }
    }
}

function makeMove(i) {
    board[i] = currentTurn;
    cells[i].textContent = currentTurn;

    let win = checkWinner(board);
    if (win) return handleWin(win);
    if (!board.includes("")) return handleDraw();

    currentTurn = currentTurn === "X" ? "O" : "X";
    turnIndicator.textContent = `Turn: ${currentTurn}`;

    let humanSymbol = (gameNumber % 2 === 1) ? "X" : "O";
    if (currentTurn !== humanSymbol) setTimeout(botMove, 500);
}

cells.forEach(cell => {
    cell.addEventListener("click", () => {
        const i = cell.dataset.index;
        let humanSymbol = (gameNumber % 2 === 1) ? "X" : "O";

        if (!gameActive || board[i] || currentTurn !== humanSymbol) return;
        makeMove(i);
    });
});

document.getElementById("bot-reset-btn").onclick = () => {
    humanScore = botScore = totalGames = 0;
    gameNumber = 1;
    humanScoreEl.textContent = botScoreEl.textContent = gamesCountEl.textContent = 0;
    startBotGame();
};

startBotGame();
}
