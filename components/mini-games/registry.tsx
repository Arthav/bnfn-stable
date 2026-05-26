import { createElement, type ReactNode } from "react";
import { ConnectFour } from "@/components/mini-games/connect-four";
import { MemoryMatch } from "@/components/mini-games/memory-match";
import { Orbito } from "@/components/mini-games/orbito";
import { Quoridor } from "@/components/mini-games/quoridor";
import { TicTacGomoku } from "@/components/mini-games/tic-tac-gomoku";
import { GameOutcome, PlayMode } from "@/components/mini-games/types";

export type RegisteredGame = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  availableModes: PlayMode[];
  render: (props: {
    mode: PlayMode;
    onGameEnd: (winner: GameOutcome) => void;
    onBack: () => void;
  }) => ReactNode;
};

export const registeredGames: RegisteredGame[] = [
  {
    id: "tic-tac-toe",
    title: "Tic-Tac-Gomoku",
    description: "Connect 5 in a row on a massive 20x20 grid.",
    imageUrl: "/images/tictactoe.png",
    availableModes: ["vs_computer", "vs_player", "competition"],
    render: ({ mode, onGameEnd, onBack }) =>
      createElement(TicTacGomoku, { mode, onGameEnd, onBack }),
  },
  {
    id: "connect-four",
    title: "Connect Four",
    description: "Connect 4 discs horizontally, vertically, or diagonally.",
    imageUrl: "/images/connect4.png",
    availableModes: ["vs_computer", "vs_player", "competition"],
    render: ({ mode, onGameEnd, onBack }) =>
      createElement(ConnectFour, { mode, onGameEnd, onBack }),
  },
  {
    id: "memory-match",
    title: "Memory Match",
    description: "Find matching pairs of cards.",
    availableModes: ["vs_player", "competition"],
    render: ({ mode, onGameEnd, onBack }) =>
      createElement(MemoryMatch, { mode, onGameEnd, onBack }),
  },
  {
    id: "quoridor",
    title: "Quoridor",
    description: "Navigate a 9x9 maze while placing walls to trap your opponent.",
    imageUrl: "/images/quoridor.png",
    availableModes: ["vs_computer", "vs_player", "competition"],
    render: ({ mode, onGameEnd, onBack }) =>
      createElement(Quoridor, { mode, onGameEnd, onBack }),
  },
  {
    id: "orbito",
    title: "Orbito",
    description: "Survive a fast-paced 4x4 shifting gravity grid. First to 4-in-a-row wins.",
    imageUrl: "/images/orbito.png",
    availableModes: ["vs_computer", "vs_player", "competition"],
    render: ({ mode, onGameEnd, onBack }) =>
      createElement(Orbito, { mode, onGameEnd, onBack }),
  },
];

export function getGamesForMode(mode: PlayMode) {
  return registeredGames.filter((game) => game.availableModes.includes(mode));
}

export function getRegisteredGame(gameId: string) {
  return registeredGames.find((game) => game.id === gameId);
}
