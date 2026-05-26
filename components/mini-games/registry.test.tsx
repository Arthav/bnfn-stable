import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/mini-games/tic-tac-gomoku", () => ({
  TicTacGomoku: () => createElement("div"),
}));
vi.mock("@/components/mini-games/connect-four", () => ({
  ConnectFour: () => createElement("div"),
}));
vi.mock("@/components/mini-games/memory-match", () => ({
  MemoryMatch: () => createElement("div"),
}));
vi.mock("@/components/mini-games/quoridor", () => ({
  Quoridor: () => createElement("div"),
}));
vi.mock("@/components/mini-games/orbito", () => ({
  Orbito: () => createElement("div"),
}));

const { getGamesForMode, getRegisteredGame, registeredGames } = await import(
  "@/components/mini-games/registry"
);

describe("mini-games registry Module", () => {
  it("exposes registered game metadata from one list", () => {
    expect(registeredGames.map((game) => game.id)).toEqual([
      "tic-tac-toe",
      "connect-four",
      "memory-match",
      "quoridor",
      "orbito",
    ]);
    expect(getRegisteredGame("orbito")?.title).toBe("Orbito");
  });

  it("filters games by play mode", () => {
    expect(getGamesForMode("vs_computer").map((game) => game.id)).not.toContain(
      "memory-match"
    );
    expect(getGamesForMode("competition").map((game) => game.id)).toContain(
      "memory-match"
    );
  });
});
