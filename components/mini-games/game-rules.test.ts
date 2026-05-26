import { describe, expect, it } from "vitest";
import {
  checkWin as checkConnectFourWin,
  createEmptyBoard as createConnectFourBoard,
  ROWS,
} from "@/components/mini-games/connect-four-logic";
import {
  checkWin as checkGomokuWin,
  createEmptyBoard as createGomokuBoard,
} from "@/components/mini-games/gomoku-logic";
import { checkMatch } from "@/components/mini-games/memory-match-logic";
import {
  checkWin as checkOrbitoWin,
  createInitialState as createOrbitoState,
} from "@/components/mini-games/orbito-logic";
import {
  createInitialState as createQuoridorState,
  getShortestPathLength,
  isValidWallPlacement,
} from "@/components/mini-games/quoridor-logic";

describe("mini-games rule Modules", () => {
  it("keeps Connect Four win checks intact", () => {
    const board = createConnectFourBoard();
    board[ROWS - 1][0] = "Red";
    board[ROWS - 1][1] = "Red";
    board[ROWS - 1][2] = "Red";
    board[ROWS - 1][3] = "Red";

    expect(checkConnectFourWin(board, ROWS - 1, 3, "Red")?.winner).toBe("Red");
  });

  it("keeps Gomoku win checks intact", () => {
    const board = createGomokuBoard();
    for (let col = 0; col < 5; col += 1) {
      board[5][col] = "X";
    }

    expect(checkGomokuWin(board, 5, 4, "X")?.winner).toBe("X");
  });

  it("keeps Orbito win checks intact", () => {
    const state = createOrbitoState();
    for (let col = 0; col < 4; col += 1) {
      state.board[0][col] = { player: "Red", id: `red-${col}` };
    }

    expect(checkOrbitoWin(state.board).winner).toBe("Red");
  });

  it("keeps Quoridor path and wall rules intact", () => {
    const state = createQuoridorState();

    expect(
      getShortestPathLength(state.p1Pos, 0, state.p2Pos, state.walls)
    ).toBeGreaterThan(0);
    expect(isValidWallPlacement(state, { r: 1, c: 1, type: "H" })).toBe(true);
  });

  it("keeps Memory Match pair checks intact", () => {
    expect(
      checkMatch(
        { id: 1, symbol: "A", isFlipped: true, isMatched: false },
        { id: 2, symbol: "A", isFlipped: true, isMatched: false }
      )
    ).toBe(true);
  });
});
