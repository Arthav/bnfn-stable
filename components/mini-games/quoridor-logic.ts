export type PlayerID = 1 | 2;
export type Position = [number, number]; // [row, col]

// Represents a wall starting at (row, col) and going Right (Horizontal) or Down (Vertical)
// A horizontal wall at (r, c) blocks movement between (r, c)<->(r+1, c) AND (r, c+1)<->(r+1, c+1)
export type Wall = {
    r: number;
    c: number;
    type: "H" | "V";
};

export interface QuoridorState {
    p1Pos: Position;
    p2Pos: Position;
    p1Walls: number;
    p2Walls: number;
    walls: Wall[];
    turn: PlayerID;
}

export const BOARD_SIZE = 9;

export const createInitialState = (): QuoridorState => ({
    p1Pos: [BOARD_SIZE - 1, Math.floor(BOARD_SIZE / 2)], // Bottom center
    p2Pos: [0, Math.floor(BOARD_SIZE / 2)],             // Top center
    p1Walls: 10,
    p2Walls: 10,
    walls: [],
    turn: 1,
});

// Checks if a movement between two adjacent cells is blocked by a wall
export const isBlockedByWall = (r1: number, c1: number, r2: number, c2: number, walls: Wall[]): boolean => {
    // Ensure moving strictly orthogonally
    if (r1 !== r2 && c1 !== c2) return false;

    // Moving vertically
    if (c1 === c2) {
        const topR = Math.min(r1, r2);
        // Horizontal wall physically exists between topR and topR+1
        // It can be placed starting at (topR, c1) OR (topR, c1-1)
        return walls.some(w => w.type === "H" && w.r === topR && (w.c === c1 || w.c === c1 - 1));
    }

    // Moving horizontally
    if (r1 === r2) {
        const leftC = Math.min(c1, c2);
        // Vertical wall physically exists between leftC and leftC+1
        // It can be placed starting at (r1, leftC) OR (r1-1, leftC)
        return walls.some(w => w.type === "V" && w.c === leftC && (w.r === r1 || w.r === r1 - 1));
    }

    return false;
};

// Generates valid moves (including jumps) for a player at `pos`
export const getValidMoves = (pos: Position, opponentPos: Position, walls: Wall[]): Position[] => {
    const valid: Position[] = [];
    const [r, c] = pos;
    const [or, oc] = opponentPos;

    const directions = [
        [-1, 0], // Up
        [1, 0],  // Down
        [0, -1], // Left
        [0, 1]   // Right
    ];

    for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;

        // Bounds check
        if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) continue;

        // Wall check
        if (isBlockedByWall(r, c, nr, nc, walls)) continue;

        // Opponent collision check (Jumping Logic)
        if (nr === or && nc === oc) {
            // Can we jump straight over?
            const jumpR = nr + dr;
            const jumpC = nc + dc;

            let straightJumpValid = false;

            if (
                jumpR >= 0 && jumpR < BOARD_SIZE && jumpC >= 0 && jumpC < BOARD_SIZE &&
                !isBlockedByWall(nr, nc, jumpR, jumpC, walls)
            ) {
                // Yes, straight jump
                valid.push([jumpR, jumpC]);
                straightJumpValid = true;
            }

            // If there's a wall or board edge directly behind the opponent, we can jump diagonally
            if (!straightJumpValid) {
                // Calculate the perpendicular moves from the opponent's position
                const diagDirs = dr !== 0
                    ? [[0, -1], [0, 1]] // Opponent is vertical to us, move left/right from them
                    : [[-1, 0], [1, 0]]; // Opponent is horizontal to us, move up/down from them

                for (const [ddr, ddc] of diagDirs) {
                    const diagR = nr + ddr;
                    const diagC = nc + ddc;
                    if (
                        diagR >= 0 && diagR < BOARD_SIZE &&
                        diagC >= 0 && diagC < BOARD_SIZE &&
                        !isBlockedByWall(nr, nc, diagR, diagC, walls)
                    ) {
                        valid.push([diagR, diagC]);
                    }
                }
            }
        } else {
            // Normal move
            valid.push([nr, nc]);
        }
    }

    return valid;
};

// Returns shortest path length from pos to goalRow using BFS. Returns -1 if no path.
export const getShortestPathLength = (pos: Position, goalRow: number, opponentPos: Position, walls: Wall[]): number => {
    const queue: { r: number, c: number, dist: number }[] = [{ r: pos[0], c: pos[1], dist: 0 }];
    const visited = new Set<string>();
    visited.add(`${pos[0]},${pos[1]}`);

    let head = 0;
    while (head < queue.length) {
        const { r, c, dist } = queue[head++];

        if (r === goalRow) return dist;

        const moves = getValidMoves([r, c], [-1, -1], walls); // We ignore opponent for pure path distance to prevent infinite loops / weird cyclic jump dependencies in basic BFS

        for (const [nr, nc] of moves) {
            const key = `${nr},${nc}`;
            if (!visited.has(key)) {
                visited.add(key);
                queue.push({ r: nr, c: nc, dist: dist + 1 });
            }
        }
    }
    return -1;
};

export const isValidWallPlacement = (state: QuoridorState, wall: Wall): boolean => {
    // 1. Bounds check
    if (wall.r < 0 || wall.r >= BOARD_SIZE - 1 || wall.c < 0 || wall.c >= BOARD_SIZE - 1) return false;

    // 2. Overlap / intersection check
    for (const w of state.walls) {
        if (w.r === wall.r && w.c === wall.c) return false; // Cross intersection
        if (w.type === wall.type) {
            // Parallel overlapping
            if (w.type === "H" && w.r === wall.r && Math.abs(w.c - wall.c) < 2) return false;
            if (w.type === "V" && w.c === wall.c && Math.abs(w.r - wall.r) < 2) return false;
        }
    }

    // 3. Pathfinding validity check (Cannot trap ANY player)
    const newWalls = [...state.walls, wall];
    const p1Path = getShortestPathLength(state.p1Pos, 0, state.p2Pos, newWalls);
    if (p1Path === -1) return false;

    const p2Path = getShortestPathLength(state.p2Pos, BOARD_SIZE - 1, state.p1Pos, newWalls);
    if (p2Path === -1) return false;

    return true;
};

// AI Logic using 1-step evaluation heuristic
export const getComputerAction = (state: QuoridorState): { type: "move", pos: Position } | { type: "wall", wall: Wall } => {
    const aiPos = state.p2Pos;
    const humanPos = state.p1Pos;
    const aiGoal = BOARD_SIZE - 1;
    const humanGoal = 0;

    let bestScore = -Infinity;
    let bestAction: { type: "move", pos: Position } | { type: "wall", wall: Wall } | null = null;

    // Evaluate standard moves
    const validMoves = getValidMoves(aiPos, humanPos, state.walls);
    for (const move of validMoves) {
        const aiDistRaw = getShortestPathLength(move, aiGoal, [-1, -1], state.walls);
        const aiDist = aiDistRaw === -1 ? 999 : aiDistRaw;

        const humanDistRaw = getShortestPathLength(humanPos, humanGoal, [-1, -1], state.walls);
        const humanDist = humanDistRaw === -1 ? 999 : humanDistRaw;

        // Base heuristic: difference in path lengths. Add random noise for tie-breaking.
        const score = (humanDist - aiDist) * 10 + Math.random();

        if (score > bestScore) {
            bestScore = score;
            bestAction = { type: "move", pos: move };
        }
    }

    // If AI has walls, evaluate wall placements (Sample a subset to avoid lag, focusing near human)
    if (state.p2Walls > 0) {
        const humanR = humanPos[0];
        const humanC = humanPos[1];

        // Only search walls around the human's current progression area to save CPU
        const rMin = Math.max(0, humanR - 2);
        const rMax = Math.min(BOARD_SIZE - 2, humanR + 3);
        const cMin = Math.max(0, humanC - 3);
        const cMax = Math.min(BOARD_SIZE - 2, humanC + 3);

        for (let r = rMin; r <= rMax; r++) {
            for (let c = cMin; c <= cMax; c++) {
                // Try Horizontal
                const wallH: Wall = { r, c, type: "H" };
                if (isValidWallPlacement(state, wallH)) {
                    const newWalls = [...state.walls, wallH];
                    const aiDistRaw = getShortestPathLength(aiPos, aiGoal, [-1, -1], newWalls);
                    let humanDistRaw = getShortestPathLength(humanPos, humanGoal, [-1, -1], newWalls);

                    // If human is trapped (shouldn't happen due to isValid), penalty
                    if (aiDistRaw !== -1 && humanDistRaw !== -1) {
                        const score = (humanDistRaw - aiDistRaw) * 10 + Math.random();
                        // Extra weight for placing walls if it significantly increases human path (>= 3 steps)
                        const originalHumanDist = getShortestPathLength(humanPos, humanGoal, [-1, -1], state.walls);
                        if (humanDistRaw - originalHumanDist >= 2) {
                            if (score + 5 > bestScore) { // Add aggressive weighting
                                bestScore = score + 5;
                                bestAction = { type: "wall", wall: wallH };
                            }
                        }
                    }
                }

                // Try Vertical
                const wallV: Wall = { r, c, type: "V" };
                if (isValidWallPlacement(state, wallV)) {
                    const newWalls = [...state.walls, wallV];
                    const aiDistRaw = getShortestPathLength(aiPos, aiGoal, [-1, -1], newWalls);
                    let humanDistRaw = getShortestPathLength(humanPos, humanGoal, [-1, -1], newWalls);

                    if (aiDistRaw !== -1 && humanDistRaw !== -1) {
                        const score = (humanDistRaw - aiDistRaw) * 10 + Math.random();
                        const originalHumanDist = getShortestPathLength(humanPos, humanGoal, [-1, -1], state.walls);
                        if (humanDistRaw - originalHumanDist >= 2) {
                            if (score + 5 > bestScore) {
                                bestScore = score + 5;
                                bestAction = { type: "wall", wall: wallV };
                            }
                        }
                    }
                }
            }
        }
    }

    // Fallback if something errors out
    if (!bestAction && validMoves.length > 0) {
        return { type: "move", pos: validMoves[0] };
    }

    return bestAction as { type: "move", pos: Position } | { type: "wall", wall: Wall };
};
