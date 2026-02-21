export type Player = "X" | "O" | null;
export type GameMode = "vs_computer" | "vs_player" | "competition";

export const BOARD_SIZE = 20;

// Initialize empty 20x20 board
export const createEmptyBoard = (): Player[][] =>
    Array(BOARD_SIZE)
        .fill(null)
        .map(() => Array(BOARD_SIZE).fill(null));

// Check if a move is valid
export const isValidMove = (board: Player[][], row: number, col: number): boolean => {
    // Cell must be empty
    if (board[row][col] !== null) return false;

    // If board is completely empty, any move is valid
    let isEmpty = true;
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] !== null) {
                isEmpty = false;
                break;
            }
        }
        if (!isEmpty) break;
    }
    if (isEmpty) return true;

    // Check 8 surrounding cells for any existing piece
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    for (const [dx, dy] of directions) {
        const r = row + dx;
        const c = col + dy;
        if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
            if (board[r][c] !== null) return true;
        }
    }

    return false;
};

// Check for win condition (5 in a row)
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
            while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
                count++;
                line.push([r, c]);
                r += dr;
                c += dc;
            }
        }

        if (count >= 5) {
            return { winner: player, line };
        }
    }

    return null;
};

// Evaluate a line for AI score calculation
const evaluateLine = (
    board: Player[][],
    row: number,
    col: number,
    dr: number,
    dc: number,
    player: Player
) => {
    let score = 0;
    let r = row;
    let c = col;
    let count = 0;
    let openEnds = 0;

    // Count backwards
    r = row - dr;
    c = col - dc;
    if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === null) openEnds++;
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
        count++;
        r -= dr;
        c -= dc;
        if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === null) openEnds++;
    }

    // Count forwards
    r = row;
    c = col;
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
        count++;
        r += dr;
        c += dc;
        if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === null) openEnds++;
    }

    // Score logic: heavily weight 4-in-a-row and open-ended 3-in-a-row
    if (count >= 5) score += 100000;
    else if (count === 4 && openEnds > 0) score += 10000;
    else if (count === 3 && openEnds === 2) score += 1000;
    else if (count === 3 && openEnds === 1) score += 100;
    else if (count === 2 && openEnds === 2) score += 10;

    return score;
};

// Basic computer AI
export const getComputerMove = (board: Player[][]) => {
    let bestScore = -Infinity;
    let bestMove: [number, number] | null = null;
    const computerPlayer: Player = "O";
    const humanPlayer: Player = "X";

    // Quick fallback for early game (try to play near center)
    let totalPieces = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] !== null) totalPieces++;
        }
    }

    if (totalPieces === 1) {
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (board[r][c] !== null) {
                    // Play next to it
                    const possibleMoves = [];
                    for (let dr = -1; dr <= 1; dr++) {
                        for (let dc = -1; dc <= 1; dc++) {
                            if (dr === 0 && dc === 0) continue;
                            let nr = r + dr, nc = c + dc;
                            if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) possibleMoves.push([nr, nc]);
                        }
                    }
                    if (possibleMoves.length > 0) {
                        return possibleMoves[Math.floor(Math.random() * possibleMoves.length)] as [number, number];
                    }
                }
            }
        }
    }

    // Scan all valid moves
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (isValidMove(board, r, c)) {
                let attackScore = 0;
                let defendScore = 0;

                const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

                // Temporarily place computer 'O'
                board[r][c] = computerPlayer;
                for (const [dr, dc] of directions) {
                    attackScore += evaluateLine(board, r, c, dr, dc, computerPlayer);
                }
                board[r][c] = null;

                // Temporarily place human 'X' to see how dangerous it is
                board[r][c] = humanPlayer;
                for (const [dr, dc] of directions) {
                    defendScore += evaluateLine(board, r, c, dr, dc, humanPlayer);
                }
                board[r][c] = null;

                // AI prioritizes defense slightly over attack to be annoying
                const totalScore = attackScore + (defendScore * 1.2);

                // Add slight randomness to prevent identical predictable games
                const randomizedScore = totalScore + Math.random() * 5;

                if (randomizedScore > bestScore) {
                    bestScore = randomizedScore;
                    bestMove = [r, c];
                }
            }
        }
    }

    // Backup fallback incase something goes wrong
    if (!bestMove) {
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (isValidMove(board, r, c)) return [r, c];
            }
        }
    }

    return bestMove;
};
