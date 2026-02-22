"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { motion } from "framer-motion";
import {
    Player,
    BOARD_SIZE,
    createEmptyBoard,
    isValidMove,
    checkWin,
    getComputerMove,
    GameMode,
} from "./gomoku-logic";

interface TicTacGomokuProps {
    mode: GameMode;
    onGameEnd: (winner: Player | "draw") => void;
    onBack?: () => void;
}

export const TicTacGomoku = ({ mode, onGameEnd, onBack }: TicTacGomokuProps) => {
    const [board, setBoard] = useState<Player[][]>(createEmptyBoard());

    // ... (rest of the state setup remains the same)

    const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
    const [winner, setWinner] = useState<Player | null>(null);
    const [winningLine, setWinningLine] = useState<[number, number][]>([]);
    const [isComputerThinking, setIsComputerThinking] = useState(false);

    const resetGame = () => {
        setBoard(createEmptyBoard());
        setCurrentPlayer("X");
        setWinner(null);
        setWinningLine([]);
        setIsComputerThinking(false);
    };

    const handleCellClick = useCallback(
        (row: number, col: number) => {
            if (winner || isComputerThinking) return;
            if (!isValidMove(board, row, col)) return;

            const newBoard = board.map((r) => [...r]);
            newBoard[row][col] = currentPlayer;
            setBoard(newBoard);

            const winResult = checkWin(newBoard, row, col, currentPlayer);
            if (winResult) {
                setWinner(winResult.winner);
                setWinningLine(winResult.line);
                onGameEnd(winResult.winner);
                return;
            }

            // Check draw
            let isDraw = true;
            for (let r = 0; r < BOARD_SIZE; r++) {
                for (let c = 0; c < BOARD_SIZE; c++) {
                    if (newBoard[r][c] === null) {
                        isDraw = false;
                        break;
                    }
                }
            }
            if (isDraw) {
                onGameEnd("draw");
                return;
            }

            setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
        },
        [board, currentPlayer, winner, isComputerThinking, onGameEnd]
    );

    useEffect(() => {
        if (mode === "vs_computer" && currentPlayer === "O" && !winner) {
            setIsComputerThinking(true);

            // Add a slight delay for realism
            const timer = setTimeout(() => {
                const move = getComputerMove(board);
                if (move) {
                    const [r, c] = move;

                    const newBoard = board.map((row) => [...row]);
                    newBoard[r][c] = "O";
                    setBoard(newBoard);

                    const winResult = checkWin(newBoard, r, c, "O");
                    if (winResult) {
                        setWinner(winResult.winner);
                        setWinningLine(winResult.line);
                        onGameEnd(winResult.winner);
                        setIsComputerThinking(false);
                        return;
                    }

                    setCurrentPlayer("X");
                }
                setIsComputerThinking(false);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [currentPlayer, mode, board, winner, onGameEnd]);

    // Determine valid cells for highlighting
    const getValidCells = () => {
        const valid = new Set<string>();
        if (winner) return valid;
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (isValidMove(board, r, c)) {
                    valid.add(`${r},${c}`);
                }
            }
        }
        return valid;
    };

    const validSet = getValidCells();

    return (
        <div className="flex flex-col items-center gap-4 w-full h-full mx-auto">
            <div className="flex justify-between w-full items-center px-2 sm:px-4">
                <div className="flex flex-col items-start">
                    <h2 className="text-2xl font-bold font-heading">Tic-Tac-Gomoku</h2>
                    <p className="text-sm text-default-500">First to 5 in a row wins. Must place adjacent to existing pieces.</p>
                </div>

                <div className="flex gap-4 items-center">
                    {winner ? (
                        <div className={`text-xl font-bold ${winner === 'X' ? 'text-primary' : 'text-secondary'} animate-bounce`}>
                            Player {winner} Wins!
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Current Turn:</span>
                            <span className={`text-xl font-bold ${currentPlayer === 'X' ? 'text-primary' : 'text-secondary'} ${isComputerThinking ? 'animate-pulse' : ''}`}>
                                {isComputerThinking ? "Computer..." : `Player ${currentPlayer}`}
                            </span>
                        </div>
                    )}
                    <div className="flex gap-2">
                        {onBack && (
                            <Button size="sm" variant="bordered" onClick={onBack}>
                                Back
                            </Button>
                        )}
                        <Button size="sm" variant="flat" color="primary" onClick={resetGame}>
                            Restart
                        </Button>
                    </div>
                </div>
            </div>

            <div className="w-full rounded-2xl border-2 border-divider p-2 sm:p-4 bg-content1 shadow-inner custom-scrollbar">
                <div
                    className="grid gap-1 mx-auto min-w-max"
                    style={{
                        gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(36px, 1fr))`,
                        gridTemplateRows: `repeat(${BOARD_SIZE}, minmax(36px, 1fr))`,
                    }}
                >
                    {board.map((rowArr, rowIndex) =>
                        rowArr.map((cell, colIndex) => {
                            const isWinningCell = winningLine.some(
                                ([r, c]) => r === rowIndex && c === colIndex
                            );
                            const isHoverable = validSet.has(`${rowIndex},${colIndex}`) && !winner;

                            return (
                                <div
                                    key={`${rowIndex}-${colIndex}`}
                                    role="button"
                                    tabIndex={isHoverable && !isComputerThinking ? 0 : -1}
                                    className={`relative w-8 h-8 sm:w-10 sm:h-10 border border-divider/50 flex items-center justify-center text-xl sm:text-2xl font-bold rounded-sm transition-all duration-200
                    ${cell === "X" ? "text-primary shadow-[inset_0_0_10px_rgba(var(--nextui-primary),0.2)]" : ""}
                    ${cell === "O" ? "text-secondary shadow-[inset_0_0_10px_rgba(var(--nextui-secondary),0.2)]" : ""}
                    ${isWinningCell ? "bg-success/20 animate-pulse border-success border-2 shadow-lg scale-110 z-10" : "bg-content2"}
                    ${isHoverable && !isComputerThinking ? "hover:bg-content3/50 cursor-pointer hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary" : "cursor-default outline-none"}
                    ${cell === null && !isHoverable ? "opacity-30" : ""}
                  `}
                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            handleCellClick(rowIndex, colIndex);
                                        }
                                    }}
                                >
                                    {cell && (
                                        <motion.span
                                            initial={{ scale: 0, rotate: cell === 'X' ? -90 : 90 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        >
                                            {cell}
                                        </motion.span>
                                    )}

                                    {/* Highlight valid empty cells on hover subtly */}
                                    {isHoverable && !cell && !isComputerThinking && (
                                        <span className="absolute inset-0 bg-primary/10 opacity-0 hover:opacity-100 rounded-sm transition-opacity" />
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: hsl(var(--nextui-content1));
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: hsl(var(--nextui-default-300));
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: hsl(var(--nextui-primary) / 0.5);
        }
      `}} />
        </div>
    );
};
