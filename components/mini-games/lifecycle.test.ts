import { describe, expect, it } from "vitest";
import {
  getMaxGameSelections,
  restoreUndoSnapshot,
  toggleSelectedGame,
} from "@/components/mini-games/lifecycle";

describe("mini-games lifecycle Module", () => {
  it("keeps mode-specific game selection limits", () => {
    expect(getMaxGameSelections("competition")).toBe(3);
    expect(getMaxGameSelections("vs_player")).toBe(1);
    expect(getMaxGameSelections(null)).toBe(1);
  });

  it("toggles selected games and respects max selections", () => {
    expect(toggleSelectedGame([], "connect-four", 1)).toEqual(["connect-four"]);
    expect(toggleSelectedGame(["connect-four"], "orbito", 1)).toEqual(["orbito"]);
    expect(toggleSelectedGame(["connect-four"], "connect-four", 3)).toEqual([]);
    expect(toggleSelectedGame(["a", "b", "c"], "d", 3)).toEqual(["a", "b", "c"]);
  });

  it("restores undo snapshots without mutating history", () => {
    const history = [{ value: 1 }, { value: 2 }, { value: 3 }];

    expect(restoreUndoSnapshot(history, 2)).toEqual({
      snapshot: { value: 2 },
      history: [{ value: 1 }],
    });
    expect(history).toHaveLength(3);
  });
});
