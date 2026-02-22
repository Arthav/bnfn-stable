export type Player = "Red" | "Yellow" | null;
export type GameMode = "vs_computer" | "vs_player" | "competition";

export const ROWS = 6;
export const COLS = 7;

// Initialize empty 7x6 board (ROWS x COLS)
// board[r][c] where r=0 is top row, r=5 is bottom row
export const createEmptyBoard = (): Player[][] =>
    Array(ROWS)
        .fill(null)
        .map(() => Array(COLS).fill(null));

// Drop a token into a column. Returns the row it lands in, or -1 if full.
export const getDropRow = (board: Player[][], col: number): number => {
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r][col] === null) {
            return r;
        }
    }
    return -1; // Column is full
};

export const isValidMove = (board: Player[][], col: number): boolean => {
    return getDropRow(board, col) !== -1;
};

// Check for win condition (4 in a row)
export const checkWin = (
    board: Player[][],
    row: number,
    col: number,
    player: Player
): { winner: Player; line: [number, number][] } | null => {
    if (!player) return null;

    const directions = [
        [[0, 1], [0, -1]],   // Horizontal
        [[1, 0], [-1, 0]],   // Vertical
        [[1, 1], [-1, -1]],  // Diagonal \
        [[1, -1], [-1, 1]]   // Diagonal /
    ];

    for (const dirPair of directions) {
        let count = 1;
        let line: [number, number][] = [[row, col]];

        for (const [dr, dc] of dirPair) {
            let r = row + dr;
            let c = col + dc;
            while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
                count++;
                line.push([r, c]);
                r += dr;
                c += dc;
            }
        }

        if (count >= 4) {
            return { winner: player, line };
        }
    }

    return null;
};

// Evaluate a board state for AI
const evaluateWindow = (window: Player[], player: Player, opponent: Player) => {
    let score = 0;
    let playerCount = 0;
    let emptyCount = 0;
    let opponentCount = 0;

    for (const cell of window) {
        if (cell === player) playerCount++;
        else if (cell === null) emptyCount++;
        else if (cell === opponent) opponentCount++;
    }

    if (playerCount === 4) {
        score += 1000;
    } else if (playerCount === 3 && emptyCount === 1) {
        score += 10;
    } else if (playerCount === 2 && emptyCount === 2) {
        score += 2;
    }

    if (opponentCount === 3 && emptyCount === 1) {
        score -= 80; // Block opponent
    } else if (opponentCount === 4) {
        score -= 10000; // MUST block
    }

    return score;
};

// Determine score for the entire board
const scorePosition = (board: Player[][], piece: Player) => {
    let score = 0;
    const oppPiece: Player = piece === "Red" ? "Yellow" : "Red";

    // Score center column (prefer center)
    let centerCount = 0;
    const centerArray = [];
    for (let r = 0; r < ROWS; r++) {
        if (board[r][Math.floor(COLS / 2)] === piece) centerCount++;
    }
    score += centerCount * 6;

    // Horizontal
    for (let r = 0; r < ROWS; r++) {
        const rowArray = board[r];
        for (let c = 0; c < COLS - 3; c++) {
            const window = rowArray.slice(c, c + 4);
            score += evaluateWindow(window, piece, oppPiece);
        }
    }

    // Vertical
    for (let c = 0; c < COLS; c++) {
        const colArray: Player[] = [];
        for (let r = 0; r < ROWS; r++) {
            colArray.push(board[r][c]);
        }
        for (let r = 0; r < ROWS - 3; r++) {
            const window = colArray.slice(r, r + 4);
            score += evaluateWindow(window, piece, oppPiece);
        }
    }

    // Positive Diagonal
    for (let r = 0; r < ROWS - 3; r++) {
        for (let c = 0; c < COLS - 3; c++) {
            const window = [board[r][c], board[r + 1][c + 1], board[r + 2][c + 2], board[r + 3][c + 3]];
            score += evaluateWindow(window, piece, oppPiece);
        }
    }

    // Negative Diagonal
    for (let r = 0; r < ROWS - 3; r++) {
        for (let c = 0; c < COLS - 3; c++) {
            const window = [board[r + 3][c], board[r + 2][c + 1], board[r + 1][c + 2], board[r][c + 3]];
            score += evaluateWindow(window, piece, oppPiece);
        }
    }

    return score;
};

// Simple Minimax or direct rule-based AI
export const getComputerMove = (board: Player[][], computerPlayer: Player = "Yellow"): number => {
    const humanPlayer: Player = computerPlayer === "Yellow" ? "Red" : "Yellow";
    let bestScore = -100000;

    // Get all valid columns
    const validLocations = [];
    for (let c = 0; c < COLS; c++) {
        if (isValidMove(board, c)) {
            validLocations.push(c);
        }
    }

    if (validLocations.length === 0) return -1;

    // Pick the best move utilizing 1-step lookahead scoring
    let bestCol = validLocations[Math.floor(Math.random() * validLocations.length)];

    for (const col of validLocations) {
        const row = getDropRow(board, col);
        if (row === -1) continue;

        const tempBoard = board.map(r => [...r]);
        tempBoard[row][col] = computerPlayer;

        // Check if this move wins immediately
        if (checkWin(tempBoard, row, col, computerPlayer)) {
            return col;
        }

        const score = scorePosition(tempBoard, computerPlayer);

        // Add small random noise to break ties
        const randomizedScore = score + Math.random();

        if (randomizedScore > bestScore) {
            bestScore = randomizedScore;
            bestCol = col;
        }
    }

    // Second pass: check if we must block the human from winning next turn
    for (const col of validLocations) {
        const row = getDropRow(board, col);
        if (row === -1) continue;

        const tempBoard = board.map(r => [...r]);
        tempBoard[row][col] = humanPlayer;
        if (checkWin(tempBoard, row, col, humanPlayer)) {
            return col; // Block them!
        }
    }

    return bestCol;
};
