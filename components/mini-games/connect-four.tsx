"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { motion, AnimatePresence } from "framer-motion";
import {
    Player,
    ROWS,
    COLS,
    createEmptyBoard,
    getDropRow,
    isValidMove,
    checkWin,
    getComputerMove,
    GameMode,
} from "./connect-four-logic";
import { playPlaceSound, playUndoSound, playWinSound } from "./game-sounds";

interface ConnectFourProps {
    mode: GameMode;
    onGameEnd: (winner: Player | "draw") => void;
    onBack?: () => void;
}

export const ConnectFour = ({ mode, onGameEnd, onBack }: ConnectFourProps) => {
    const [board, setBoard] = useState<Player[][]>(createEmptyBoard());
    const [history, setHistory] = useState<{ board: Player[][]; currentPlayer: Player }[]>([]);
    const [currentPlayer, setCurrentPlayer] = useState<Player>("Red"); // Red goes first usually
    const [winner, setWinner] = useState<Player | null>(null);
    const [winningLine, setWinningLine] = useState<[number, number][]>([]);
    const [isComputerThinking, setIsComputerThinking] = useState(false);
    const [hoverCol, setHoverCol] = useState<number | null>(null);

    const resetGame = () => {
        setBoard(createEmptyBoard());
        setCurrentPlayer("Red");
        setWinner(null);
        setWinningLine([]);
        setIsComputerThinking(false);
        setHoverCol(null);
        setHistory([]);
    };

    const handleUndo = useCallback(() => {
        if (history.length === 0 || winner) return;

        const popCount = mode === "vs_computer" ? 2 : 1;

        const actualPopCount = Math.min(popCount, history.length);
        const targetState = history[history.length - actualPopCount];

        setBoard(targetState.board);
        setCurrentPlayer(targetState.currentPlayer);
        setHistory(prev => prev.slice(0, prev.length - actualPopCount));
        playUndoSound();

        // Ensure UI doesn't visually hang
        setHoverCol(null);
    }, [history, winner, mode]);

    const handleColumnClick = useCallback(
        (col: number) => {
            if (winner || isComputerThinking) return;
            const dropRow = getDropRow(board, col);
            if (dropRow === -1) return; // Column full

            const newBoard = board.map((r) => [...r]);
            newBoard[dropRow][col] = currentPlayer;

            setHistory(prev => [...prev, { board: board.map(r => [...r]), currentPlayer }]);

            setBoard(newBoard);
            playPlaceSound();

            const winResult = checkWin(newBoard, dropRow, col, currentPlayer);
            if (winResult) {
                setWinner(winResult.winner);
                setWinningLine(winResult.line);
                playWinSound();
                onGameEnd(winResult.winner);
                return;
            }

            // Check draw (top row is completely full)
            if (newBoard[0].every(cell => cell !== null)) {
                onGameEnd("draw");
                return;
            }

            setCurrentPlayer(currentPlayer === "Red" ? "Yellow" : "Red");
        },
        [board, currentPlayer, winner, isComputerThinking, onGameEnd]
    );

    useEffect(() => {
        if (mode === "vs_computer" && currentPlayer === "Yellow" && !winner) {
            setIsComputerThinking(true);

            // Delay for realism so user sees computer thinking
            const timer = setTimeout(() => {
                const bestCol = getComputerMove(board, "Yellow");
                if (bestCol !== -1) {
                    const row = getDropRow(board, bestCol);
                    if (row !== -1) {
                        const newBoard = board.map((r) => [...r]);
                        newBoard[row][bestCol] = "Yellow";

                        setHistory(prev => [...prev, { board: board.map(r => [...r]), currentPlayer: "Yellow" }]);

                        setBoard(newBoard);

                        const winResult = checkWin(newBoard, row, bestCol, "Yellow");
                        if (winResult) {
                            setWinner(winResult.winner);
                            setWinningLine(winResult.line);
                            playWinSound();
                            onGameEnd(winResult.winner);
                            setIsComputerThinking(false);
                            return;
                        }

                        // Check draw
                        if (newBoard[0].every(cell => cell !== null)) {
                            onGameEnd("draw");
                            setIsComputerThinking(false);
                            return;
                        }

                        setCurrentPlayer("Red");
                    }
                }
                setIsComputerThinking(false);
            }, 600);

            return () => clearTimeout(timer);
        }
    }, [currentPlayer, mode, board, winner, onGameEnd]);

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-5xl mx-auto py-4">
            {/* Header info */}
            <div className="flex justify-between w-full items-center px-4">
                <div className="flex flex-col items-start">
                    <h2 className="text-3xl font-bold font-heading">Connect Four</h2>
                    <p className="text-sm text-default-500">Connect 4 pieces horizontally, vertically, or diagonally.</p>
                </div>

                <div className="flex gap-4 items-center">
                    {winner ? (
                        <div className={`text-2xl font-bold ${winner === 'Red' ? 'text-danger' : 'text-warning'} animate-bounce`}>
                            {winner} Wins!
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">Turn:</span>
                            <div className="flex items-center gap-2">
                                <span className={`w-4 h-4 rounded-full ${currentPlayer === 'Red' ? 'bg-danger' : 'bg-warning'} shadow-md`} />
                                <span className={`text-xl font-bold ${currentPlayer === 'Red' ? 'text-danger' : 'text-warning'} ${isComputerThinking ? 'animate-pulse' : ''}`}>
                                    {isComputerThinking ? "Thinking..." : currentPlayer}
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="flex gap-2 ml-4">
                        {onBack && (
                            <Button size="sm" variant="bordered" onClick={onBack}>
                                Back
                            </Button>
                        )}
                        <Button
                            size="sm"
                            variant="flat"
                            color="warning"
                            onClick={handleUndo}
                            isDisabled={history.length === 0 || winner !== null}
                        >
                            Undo
                        </Button>
                        <Button size="sm" color="primary" variant="flat" onClick={resetGame}>
                            Restart
                        </Button>
                    </div>
                </div>
            </div>

            {/* Game Board Container */}
            <div className="relative w-full max-w-3xl aspect-[7/6] mt-4 flex flex-col pt-10">

                {/* Hover Indicators (top row) */}
                <div className="absolute top-0 left-0 right-0 h-10 flex px-2 sm:px-4 z-0">
                    {Array.from({ length: COLS }).map((_, colIndex) => {
                        const isHovered = hoverCol === colIndex && !winner && !isComputerThinking;
                        const canDrop = isValidMove(board, colIndex);

                        return (
                            <div
                                key={`hover-${colIndex}`}
                                role="button"
                                tabIndex={canDrop && !isComputerThinking ? 0 : -1}
                                className="flex-1 flex justify-center items-center h-full relative outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
                                onMouseEnter={() => setHoverCol(colIndex)}
                                onMouseLeave={() => setHoverCol(null)}
                                onClick={() => canDrop && handleColumnClick(colIndex)}
                                onKeyDown={(e) => {
                                    if ((e.key === "Enter" || e.key === " ") && canDrop) {
                                        e.preventDefault();
                                        handleColumnClick(colIndex);
                                    }
                                }}
                            >
                                <AnimatePresence>
                                    {isHovered && canDrop && (
                                        <motion.div
                                            initial={{ y: -20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -10, opacity: 0 }}
                                            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full shadow-lg ${currentPlayer === 'Red' ? 'bg-danger/80' : 'bg-warning/80'}`}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                <div className="flex-1 bg-blue-600 rounded-3xl shadow-2xl p-2 sm:p-4 z-10 grid gap-2 sm:gap-4 relative overflow-hidden"
                    style={{
                        gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
                        gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
                    }}>

                    {board.map((rowArr, rowIndex) =>
                        rowArr.map((cellPlayer, colIndex) => {
                            const isWinningCell = winningLine.some(
                                ([r, c]) => r === rowIndex && c === colIndex
                            );

                            return (
                                <div
                                    key={`cell-${rowIndex}-${colIndex}`}
                                    role="button"
                                    tabIndex={-1} // Focus handled by the top-row hover indicators
                                    className="relative w-full h-full flex items-center justify-center aspect-square outline-none"
                                    onMouseEnter={() => setHoverCol(colIndex)}
                                    onClick={() => handleColumnClick(colIndex)}
                                >
                                    {/* The empty hole cutout (white/darkbg depending on theme) */}
                                    <div className="absolute inset-0 bg-background rounded-full shadow-[inset_0_4px_8px_rgba(0,0,0,0.6)]" />

                                    {/* The Piece */}
                                    <AnimatePresence>
                                        {cellPlayer && (
                                            <motion.div
                                                initial={{ y: -(rowIndex + 1) * 100, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 200,
                                                    damping: 15,
                                                    mass: 1.2
                                                }}
                                                className={`absolute inset-2 sm:inset-3 rounded-full shadow-md z-20 
                                                    ${cellPlayer === 'Red' ? 'bg-danger' : 'bg-warning'}
                                                    ${isWinningCell ? 'ring-4 ring-white shadow-[0_0_20px_rgba(255,255,255,0.8)] z-30' : ''}
                                                `}
                                            >
                                                {/* Add some gradient 3d effect to the token */}
                                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/20 to-transparent" />
                                                <div className="absolute top-1 left-1 right-1 bottom-3 rounded-full bg-gradient-to-b from-white/30 to-transparent opacity-50" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};
