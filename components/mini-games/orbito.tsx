"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Button } from "@nextui-org/button";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
    Player,
    Marble,
    OrbitoState,
    BOARD_SIZE,
    createInitialState,
    isValidAdjacentMove,
    shiftBoard,
    checkWin,
    getComputerAction,
} from "./orbito-logic";

export type GameMode = "vs_computer" | "vs_player" | "competition";

interface OrbitoProps {
    mode: GameMode;
    onGameEnd: (winner: string | "draw") => void;
    onBack?: () => void;
}

export const Orbito = ({ mode, onGameEnd, onBack }: OrbitoProps) => {
    const [gameState, setGameState] = useState<OrbitoState>(createInitialState());
    const [history, setHistory] = useState<OrbitoState[]>([]);
    const [winner, setWinner] = useState<string | null>(null);
    const [winningLine, setWinningLine] = useState<[number, number][] | null>(null);
    const [isComputerThinking, setIsComputerThinking] = useState(false);
    const newlyPlacedId = useRef<string | null>(null);

    const cloneState = (state: OrbitoState): OrbitoState => ({
        board: state.board.map(row => row.map(cell => cell ? { ...cell } : null)),
        turn: state.turn,
        phase: state.phase,
        selectedOpponentPiece: state.selectedOpponentPiece ? [...state.selectedOpponentPiece] : null,
    });

    const resetGame = () => {
        setGameState(createInitialState());
        setHistory([]);
        setWinner(null);
        setWinningLine(null);
        setIsComputerThinking(false);
    };

    const handleUndo = () => {
        if (history.length === 0 || winner) return;
        const popCount = mode === "vs_computer" ? 2 : 1;
        const actualPopCount = Math.min(popCount, history.length);
        const targetState = history[history.length - actualPopCount];

        setGameState(cloneState(targetState));
        setHistory(prev => prev.slice(0, prev.length - actualPopCount));
    };

    // Tracks if a cell is currently marked as a valid target for a "Sneaky" move
    const isValidSneakyTarget = (r: number, c: number) => {
        if (gameState.phase !== "optional_move" || !gameState.selectedOpponentPiece) return false;
        const [sr, sc] = gameState.selectedOpponentPiece;
        return isValidAdjacentMove(gameState.board, sr, sc, r, c);
    };

    const handleCellClick = (r: number, c: number) => {
        if (winner || isComputerThinking || gameState.phase === "shift") return;

        const isP1Turn = gameState.turn === 1;
        const myColor: Player = isP1Turn ? "Red" : "Blue";
        const oppColor: Player = isP1Turn ? "Blue" : "Red";
        const cell = gameState.board[r][c];

        if (gameState.phase === "optional_move") {
            if (cell?.player === oppColor) {
                // Select an opponent's piece to shift
                setGameState({ ...gameState, selectedOpponentPiece: [r, c] });
            } else if (cell === null) {
                if (gameState.selectedOpponentPiece) {
                    // Attempting to move the selected opponent piece here
                    const [sr, sc] = gameState.selectedOpponentPiece;
                    if (isValidAdjacentMove(gameState.board, sr, sc, r, c)) {
                        // Save history before sneaky move so undo works correctly
                        setHistory(prev => [...prev, cloneState(gameState)]);

                        const newBoard = gameState.board.map(row => [...row]);
                        newBoard[r][c] = newBoard[sr][sc];
                        newBoard[sr][sc] = null;

                        setGameState({
                            board: newBoard,
                            turn: gameState.turn,
                            phase: "place",
                            selectedOpponentPiece: null
                        });
                    } else {
                        // Deselect if invalid click
                        setGameState({ ...gameState, selectedOpponentPiece: null });
                    }
                } else {
                    // Save history purely before any piece is placed or moved
                    setHistory(prev => [...prev, cloneState(gameState)]);

                    const marbleId = crypto.randomUUID();
                    newlyPlacedId.current = marbleId;
                    // Directly place own piece (skips sneaky move)
                    const newBoard = gameState.board.map(row => [...row]);
                    newBoard[r][c] = { player: myColor, id: marbleId };

                    setGameState({
                        board: newBoard,
                        turn: gameState.turn,
                        phase: "shift",
                        selectedOpponentPiece: null
                    });
                }
            }
        } else if (gameState.phase === "place") {
            if (cell === null) {
                const newBoard = gameState.board.map(row => [...row]);
                const marbleId = crypto.randomUUID();
                newlyPlacedId.current = marbleId;
                newBoard[r][c] = { player: myColor, id: marbleId };

                setGameState({
                    board: newBoard,
                    turn: gameState.turn,
                    phase: "shift",
                    selectedOpponentPiece: null
                });
            }
        }
    };

    const commitShift = useCallback((boardToShift: (Marble | null)[][], turnFinished: 1 | 2) => {
        const newBoard = shiftBoard(boardToShift);
        const winCheck = checkWin(newBoard);

        // Also check if board is completely full for a draw
        const isFull = newBoard.every(row => row.every(cell => cell !== null));

        const nextTurn = turnFinished === 1 ? 2 : 1;

        setGameState({
            board: newBoard,
            turn: nextTurn,
            phase: "optional_move",
            selectedOpponentPiece: null
        });

        if (winCheck.winner) {
            setWinner(winCheck.winner);
            setWinningLine(winCheck.line);
            onGameEnd(winCheck.winner);
        } else if (isFull) {
            setWinner("Draw");
            onGameEnd("draw");
        }
    }, [onGameEnd]);

    const handleOrbitoButton = () => {
        if (gameState.phase !== "shift" || winner || isComputerThinking) return;
        commitShift(gameState.board, gameState.turn);
    };

    // Computer AI Effect — only triggers when it becomes the AI's turn
    const aiCancelledRef = useRef(false);

    useEffect(() => {
        if (mode !== "vs_computer" || gameState.turn !== 2 || gameState.phase !== "optional_move" || winner) return;

        aiCancelledRef.current = false;
        setIsComputerThinking(true);
        setHistory(prev => [...prev, cloneState(gameState)]);

        const boardSnapshot = gameState.board.map(r => r.map(c => c ? { ...c } : null));
        const stateSnapshot = { ...gameState, board: boardSnapshot };

        setTimeout(() => {
            if (aiCancelledRef.current) return;

            const action = getComputerAction(stateSnapshot);
            if (!action) {
                setIsComputerThinking(false);
                return;
            }

            const workingBoard = boardSnapshot.map(r => [...r]);

            if (action.type === "move_and_place") {
                const [fr, fc] = action.from;
                const [tr, tc] = action.to;
                workingBoard[tr][tc] = workingBoard[fr][fc];
                workingBoard[fr][fc] = null;

                setGameState({
                    board: workingBoard.map(r => [...r]),
                    turn: 2,
                    phase: "place",
                    selectedOpponentPiece: null
                });
            }

            // Place marble after a short delay
            setTimeout(() => {
                if (aiCancelledRef.current) return;

                const placedBoard = workingBoard.map(r => [...r]);
                const [pr, pc] = action.place;
                placedBoard[pr][pc] = { player: "Blue", id: crypto.randomUUID() };

                setGameState({
                    board: placedBoard,
                    turn: 2,
                    phase: "shift",
                    selectedOpponentPiece: null
                });

                // Shift after showing the placement
                setTimeout(() => {
                    if (aiCancelledRef.current) return;
                    commitShift(placedBoard, 2);
                    setIsComputerThinking(false);
                }, 1200);
            }, 600);
        }, 800);

        return () => { aiCancelledRef.current = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState.turn, mode, winner]);

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-5xl mx-auto py-4">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between w-full items-center px-4 gap-4">
                <div className="flex flex-col items-start text-center sm:text-left">
                    <h2 className="text-3xl font-bold font-heading">Orbito</h2>
                    <p className="text-sm text-default-500">First to 4-in-a-row. Win rules apply <i>after</i> the gravity shift.</p>
                </div>

                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-4 px-4 py-2 bg-content2 rounded-xl border border-divider">
                        <div className={`flex flex-col items-center min-w-[60px] ${gameState.turn === 1 ? 'opacity-100 scale-110' : 'opacity-50'} transition-all`}>
                            <span className="text-xs font-bold text-foreground">Player 1</span>
                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-500 to-red-800 shadow-md border-2 border-red-400 mt-1" />
                        </div>
                        <div className="w-px h-8 bg-divider" />
                        <div className={`flex flex-col items-center min-w-[60px] ${gameState.turn === 2 ? 'opacity-100 scale-110' : 'opacity-50'} transition-all`}>
                            <span className="text-xs font-bold text-foreground">{mode === 'vs_computer' ? 'Computer' : 'Player 2'}</span>
                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 shadow-md border-2 border-blue-300 mt-1" />
                        </div>
                    </div>

                    <div className="flex gap-2">
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

            {/* Turn Announcer */}
            <div className="h-10">
                <AnimatePresence mode="wait">
                    {winner ? (
                        <motion.div key="winner" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`text-2xl font-bold text-primary animate-pulse`}>
                            {winner === "Draw" ? "The Grid Filled. IT'S A TIE!" : `${winner} Wins!`}
                        </motion.div>
                    ) : (
                        <motion.div key="turn-info" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} className="flex flex-col items-center">
                            <span className={`text-xl font-bold ${isComputerThinking ? 'text-warning animate-pulse' : 'text-primary'}`}>
                                {isComputerThinking ? "Computer is calculating shift trajectory..." : `Phase: ${gameState.phase === "shift" ? "Hit the ORBITO Button!" : (gameState.phase === "optional_move" ? "Move Opponent Marble OR Place Yours" : "Place Your Marble")}`}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Game Board Container */}
            <div className="relative p-6 sm:p-10 bg-content2 rounded-[3rem] border-8 border-content3 shadow-2xl overflow-hidden aspect-square max-w-[500px] w-full flex items-center justify-center">

                {/* Direction arrows between slots */}
                <div className="absolute inset-0 z-20 pointer-events-none" style={{ padding: 'inherit' }}>
                    <div className="relative w-full h-full">
                        {/* Outer ring — Clockwise (blue) */}
                        {/* Top row → */}
                        <span className="absolute text-blue-400/40 text-[10px] sm:text-xs font-bold" style={{ top: '8.5%', left: '22%' }}>→</span>
                        <span className="absolute text-blue-400/40 text-[10px] sm:text-xs font-bold" style={{ top: '8.5%', left: '48%' }}>→</span>
                        <span className="absolute text-blue-400/40 text-[10px] sm:text-xs font-bold" style={{ top: '8.5%', left: '75%' }}>→</span>
                        {/* Right col ↓ */}
                        <span className="absolute text-blue-400/40 text-[10px] sm:text-xs font-bold" style={{ top: '22%', left: '88%' }}>↓</span>
                        <span className="absolute text-blue-400/40 text-[10px] sm:text-xs font-bold" style={{ top: '48%', left: '88%' }}>↓</span>
                        <span className="absolute text-blue-400/40 text-[10px] sm:text-xs font-bold" style={{ top: '75%', left: '88%' }}>↓</span>
                        {/* Bottom row ← */}
                        <span className="absolute text-blue-400/40 text-[10px] sm:text-xs font-bold" style={{ top: '88%', left: '75%' }}>←</span>
                        <span className="absolute text-blue-400/40 text-[10px] sm:text-xs font-bold" style={{ top: '88%', left: '48%' }}>←</span>
                        <span className="absolute text-blue-400/40 text-[10px] sm:text-xs font-bold" style={{ top: '88%', left: '22%' }}>←</span>
                        {/* Left col ↑ */}
                        <span className="absolute text-blue-400/40 text-[10px] sm:text-xs font-bold" style={{ top: '75%', left: '8%' }}>↑</span>
                        <span className="absolute text-blue-400/40 text-[10px] sm:text-xs font-bold" style={{ top: '48%', left: '8%' }}>↑</span>
                        <span className="absolute text-blue-400/40 text-[10px] sm:text-xs font-bold" style={{ top: '22%', left: '8%' }}>↑</span>

                        {/* Inner ring — Counter-clockwise (orange) */}
                        <span className="absolute text-orange-400/40 text-[10px] sm:text-xs font-bold" style={{ top: '33%', left: '48%' }}>←</span>
                        <span className="absolute text-orange-400/40 text-[10px] sm:text-xs font-bold" style={{ top: '48%', left: '36%' }}>↓</span>
                        <span className="absolute text-orange-400/40 text-[10px] sm:text-xs font-bold" style={{ top: '62%', left: '48%' }}>→</span>
                        <span className="absolute text-orange-400/40 text-[10px] sm:text-xs font-bold" style={{ top: '48%', left: '63%' }}>↑</span>
                    </div>
                </div>

                {/* Subgrid Component */}
                <LayoutGroup>
                    <div className="grid grid-cols-4 grid-rows-4 gap-3 sm:gap-6 relative z-10 w-full h-full">
                        {gameState.board.map((row, r) =>
                            row.map((cell, c) => {
                                const isSelected = gameState.selectedOpponentPiece?.[0] === r && gameState.selectedOpponentPiece?.[1] === c;
                                const isTarget = isValidSneakyTarget(r, c);
                                const isWinNode = winningLine?.some(([wr, wc]) => wr === r && wc === c);
                                const isInteractable = !winner && !isComputerThinking && gameState.phase !== "shift";
                                const isNewlyPlaced = cell ? cell.id === newlyPlacedId.current : false;

                                return (
                                    <div
                                        key={`cell-${r}-${c}`}
                                        role="button"
                                        tabIndex={isInteractable ? 0 : -1}
                                        className={`relative flex items-center justify-center rounded-full aspect-square ring-inset
                                        ${cell === null ? 'bg-zinc-950 shadow-[inset_0_10px_20px_rgba(0,0,0,0.8)]' : 'bg-transparent'}
                                        ${isTarget ? 'ring-4 ring-warning/60 bg-warning/20' : 'ring-2 ring-zinc-800'}
                                    `}
                                        onClick={() => handleCellClick(r, c)}
                                        onKeyDown={(e) => {
                                            if ((e.key === "Enter" || e.key === " ") && isInteractable) {
                                                e.preventDefault();
                                                handleCellClick(r, c);
                                            }
                                        }}
                                    >
                                        {cell && (
                                            <motion.div
                                                key={cell.id}
                                                layoutId={cell.id}
                                                initial={isNewlyPlaced ? { scale: 0, opacity: 0 } : false}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{
                                                    layout: { type: "spring", stiffness: 180, damping: 22 },
                                                    scale: { type: "spring", stiffness: 300, damping: 20 },
                                                    opacity: { duration: 0.2 }
                                                }}
                                                className={`absolute inset-1 rounded-full shadow-xl
                                                ${cell.player === 'Red' ? 'bg-gradient-to-br from-red-500 to-red-800' : 'bg-gradient-to-br from-blue-400 to-blue-700'}
                                                ${isSelected ? 'ring-4 ring-offset-2 ring-warning ring-offset-content2 animate-pulse' : ''}
                                                ${isWinNode ? 'ring-4 ring-offset-2 ring-success ring-offset-content2 shadow-[0_0_20px_rgba(34,197,94,0.6)]' : ''}
                                            `}
                                            >
                                                <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-transparent to-white/30" />
                                            </motion.div>
                                        )}
                                    </div>
                                )
                            })
                        )}
                    </div>
                </LayoutGroup>

                {/* Orbito Global Shift Button in Center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                    <Button
                        isIconOnly
                        variant="shadow"
                        color={gameState.phase === "shift" ? "danger" : "default"}
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full text-white font-bold text-center border-4 border-white/20 shadow-2xl
                            ${gameState.phase === "shift" && !isComputerThinking ? 'animate-pulse scale-110 shadow-[0_0_30px_rgba(243,18,96,0.6)]' : 'opacity-50'}
                        `}
                        disabled={gameState.phase !== "shift" || isComputerThinking || !!winner}
                        onClick={handleOrbitoButton}
                    >
                        SHIFT
                    </Button>
                </div>
            </div>
        </div>
    );
};
