export type Player = "Red" | "Blue";

export interface Marble {
    player: Player;
    id: string; // Crucial for framer-motion physical layout transitions
}

export interface OrbitoState {
    board: (Marble | null)[][];
    turn: 1 | 2; // 1 = Red, 2 = Blue
    phase: "optional_move" | "place" | "shift";
    selectedOpponentPiece: [number, number] | null;
}

export const BOARD_SIZE = 4;

export const createInitialState = (): OrbitoState => ({
    board: Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)),
    turn: 1,
    phase: "optional_move",
    selectedOpponentPiece: null,
});

/**
 * Returns true if the coordinates are within the 4x4 board.
 */
export const isValidCoord = (r: number, c: number) => {
    return r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE;
};

/**
 * Validates if an opponent's piece can be moved to an adjacent empty spot.
 */
export const isValidAdjacentMove = (board: (Marble | null)[][], fromR: number, fromC: number, toR: number, toC: number): boolean => {
    if (!isValidCoord(toR, toC)) return false;
    if (board[toR][toC] !== null) return false;

    // Orthogonal or diagonal adjacent
    const rDiff = Math.abs(fromR - toR);
    const cDiff = Math.abs(fromC - toC);

    return (rDiff <= 1 && cDiff <= 1) && !(rDiff === 0 && cDiff === 0);
};

/**
 * Shifting logic for Orbito.
 * Outer ring shifts counter-clockwise (Left, Down, Right, Up).
 * Inner ring (2x2) shifts clockwise (Right, Down, Left, Up).
 */
export const shiftBoard = (board: (Marble | null)[][]): (Marble | null)[][] => {
    const newBoard = board.map(row => [...row]);

    // Outer ring elements (clockwise: top→right, right→bottom, bottom→left, left→top)
    // Top row shifts right
    newBoard[0][1] = board[0][0];
    newBoard[0][2] = board[0][1];
    newBoard[0][3] = board[0][2];

    // Right column shifts down
    newBoard[1][3] = board[0][3];
    newBoard[2][3] = board[1][3];
    newBoard[3][3] = board[2][3];

    // Bottom row shifts left
    newBoard[3][2] = board[3][3];
    newBoard[3][1] = board[3][2];
    newBoard[3][0] = board[3][1];

    // Left column shifts up
    newBoard[2][0] = board[3][0];
    newBoard[1][0] = board[2][0];
    newBoard[0][0] = board[1][0];

    // Inner ring elements (counter-clockwise: opposite to outer)
    newBoard[1][1] = board[1][2];
    newBoard[1][2] = board[2][2];
    newBoard[2][2] = board[2][1];
    newBoard[2][1] = board[1][1];

    return newBoard;
};

/**
 * Checks for exactly 4 in a row.
 */
export const checkWin = (board: (Marble | null)[][]): { winner: string | null, line: [number, number][] | null } => {
    // Check rows
    for (let r = 0; r < BOARD_SIZE; r++) {
        if (board[r][0] && board[r][1] && board[r][2] && board[r][3] &&
            board[r][0]?.player === board[r][1]?.player &&
            board[r][0]?.player === board[r][2]?.player &&
            board[r][0]?.player === board[r][3]?.player) {
            return { winner: board[r][0]?.player || null, line: [[r, 0], [r, 1], [r, 2], [r, 3]] };
        }
    }

    // Check cols
    for (let c = 0; c < BOARD_SIZE; c++) {
        if (board[0][c] && board[1][c] && board[2][c] && board[3][c] &&
            board[0][c]?.player === board[1][c]?.player &&
            board[0][c]?.player === board[2][c]?.player &&
            board[0][c]?.player === board[3][c]?.player) {
            return { winner: board[0][c]?.player || null, line: [[0, c], [1, c], [2, c], [3, c]] };
        }
    }

    // Check diagonals
    if (board[0][0] && board[1][1] && board[2][2] && board[3][3] &&
        board[0][0]?.player === board[1][1]?.player &&
        board[0][0]?.player === board[2][2]?.player &&
        board[0][0]?.player === board[3][3]?.player) {
        return { winner: board[0][0]?.player || null, line: [[0, 0], [1, 1], [2, 2], [3, 3]] };
    }
    if (board[0][3] && board[1][2] && board[2][1] && board[3][0] &&
        board[0][3]?.player === board[1][2]?.player &&
        board[0][3]?.player === board[2][1]?.player &&
        board[0][3]?.player === board[3][0]?.player) {
        return { winner: board[0][3]?.player || null, line: [[0, 3], [1, 2], [2, 1], [3, 0]] };
    }

    return { winner: null, line: null };
};

export type OrbitoAction =
    | { type: "move_and_place", from: [number, number], to: [number, number], place: [number, number] }
    | { type: "place_only", place: [number, number] };


export const getComputerAction = (state: OrbitoState): OrbitoAction | null => {
    const aiPlayer: Player = "Blue";
    const humanPlayer: Player = "Red";

    const emptyCells: [number, number][] = [];
    const humanCells: [number, number][] = [];

    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (state.board[r][c] === null) {
                emptyCells.push([r, c]);
            } else if (state.board[r][c]?.player === humanPlayer) {
                humanCells.push([r, c]);
            }
        }
    }

    if (emptyCells.length === 0) return null;

    // Helper to generate a dummy marble for simulation
    const mockMarble = (player: Player): Marble => ({ player, id: "mock" });

    // First priority: Can we win just by placing somewhere and shifting?
    for (const [pr, pc] of emptyCells) {
        const testBoard = state.board.map(row => [...row]);
        testBoard[pr][pc] = mockMarble(aiPlayer);
        const shifted = shiftBoard(testBoard);
        if (checkWin(shifted).winner === aiPlayer) {
            return { type: "place_only", place: [pr, pc] };
        }
    }

    // Second priority: If the human can win in their next simple place -> shift, we must block it.
    let blockingPlaceMove: [number, number] | null = null;
    for (const [hr, hc] of emptyCells) {
        const testBoard = state.board.map(row => [...row]);
        testBoard[hr][hc] = mockMarble(humanPlayer);
        const shifted = shiftBoard(testBoard);
        if (checkWin(shifted).winner === humanPlayer) {
            blockingPlaceMove = [hr, hc];
            break;
        }
    }

    if (blockingPlaceMove) {
        return { type: "place_only", place: blockingPlaceMove };
    }

    // Third priority: Try to find a Sneaky Move
    if (Math.random() > 0.5 && humanCells.length > 0) {
        for (const [hr, hc] of humanCells) {
            for (const [er, ec] of emptyCells) {
                if (isValidAdjacentMove(state.board, hr, hc, er, ec)) {
                    const testBoard = state.board.map(row => [...row]);
                    const movingPiece = testBoard[hr][hc];
                    testBoard[hr][hc] = null;
                    testBoard[er][ec] = movingPiece as Marble;

                    const remainingEmpty = emptyCells.filter(([r, c]) => !(r === er && c === ec));
                    remainingEmpty.push([hr, hc]);

                    if (remainingEmpty.length > 0) {
                        const randomPlace = remainingEmpty[Math.floor(Math.random() * remainingEmpty.length)];
                        return { type: "move_and_place", from: [hr, hc], to: [er, ec], place: randomPlace };
                    }
                }
            }
        }
    }

    // Fallbacks
    const centers = emptyCells.filter(([r, c]) => (r === 1 && c === 1) || (r === 1 && c === 2) || (r === 2 && c === 1) || (r === 2 && c === 2));
    if (centers.length > 0) {
        const randomCenter = centers[Math.floor(Math.random() * centers.length)];
        return { type: "place_only", place: randomCenter };
    }

    const randomEmpty = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    return { type: "place_only", place: randomEmpty };
};
