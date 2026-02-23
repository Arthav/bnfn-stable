"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { motion, AnimatePresence } from "framer-motion";
import {
    PlayerID,
    Position,
    Wall,
    QuoridorState,
    BOARD_SIZE,
    createInitialState,
    getValidMoves,
    isValidWallPlacement,
    getComputerAction,
} from "./quoridor-logic";
import { playPlaceSound, playUndoSound, playWinSound } from "./game-sounds";

export type GameMode = "vs_computer" | "vs_player" | "competition";

interface QuoridorProps {
    mode: GameMode;
    onGameEnd: (winner: string | "draw") => void;
    onBack?: () => void;
}

export const Quoridor = ({ mode, onGameEnd, onBack }: QuoridorProps) => {
    const [gameState, setGameState] = useState<QuoridorState>(createInitialState());
    const [history, setHistory] = useState<QuoridorState[]>([]);
    const [hoverWall, setHoverWall] = useState<Wall | null>(null);
    const [winner, setWinner] = useState<string | null>(null);
    const [isComputerThinking, setIsComputerThinking] = useState(false);

    // Derived state for quick lookups
    const validMoves = getValidMoves(
        gameState.turn === 1 ? gameState.p1Pos : gameState.p2Pos,
        gameState.turn === 1 ? gameState.p2Pos : gameState.p1Pos,
        gameState.walls
    );

    const resetGame = () => {
        setGameState(createInitialState());
        setWinner(null);
        setHoverWall(null);
        setIsComputerThinking(false);
        setHistory([]);
    };

    const handleUndo = useCallback(() => {
        if (history.length === 0 || winner) return;

        const popCount = mode === "vs_computer" ? 2 : 1;

        const actualPopCount = Math.min(popCount, history.length);
        const targetState = history[history.length - actualPopCount];

        // Deep copy from history
        setGameState({
            ...targetState,
            p1Pos: [...targetState.p1Pos],
            p2Pos: [...targetState.p2Pos],
            walls: targetState.walls.map(w => ({ ...w }))
        });
        setHistory(prev => prev.slice(0, prev.length - actualPopCount));
        playUndoSound();
        setHoverWall(null);
    }, [history, winner, mode]);

    const checkWinCondition = (state: QuoridorState) => {
        if (state.p1Pos[0] === 0) return "Player 1"; // P1 reached top
        if (state.p2Pos[0] === BOARD_SIZE - 1) return mode === "vs_computer" ? "Computer" : "Player 2"; // P2 reached bottom
        return null;
    };

    const commitAction = useCallback((newState: QuoridorState) => {
        // Save history snapshot of CURRENT state BEFORE committing NEW state
        setHistory(prev => [
            ...prev,
            {
                ...gameState,
                p1Pos: [...gameState.p1Pos],
                p2Pos: [...gameState.p2Pos],
                walls: gameState.walls.map(w => ({ ...w }))
            }
        ]);

        setGameState(newState);
        playPlaceSound();
        const winResult = checkWinCondition(newState);
        if (winResult) {
            setWinner(winResult);
            playWinSound();
            onGameEnd(winResult);
        }
    }, [mode, onGameEnd]);

    const handleCellClick = (r: number, c: number) => {
        if (winner || isComputerThinking) return;

        // Check if the clicked cell is a valid move
        const isValidMove = validMoves.some(([vr, vc]) => vr === r && vc === c);
        if (isValidMove) {
            const newState = { ...gameState };
            if (gameState.turn === 1) {
                newState.p1Pos = [r, c];
                newState.turn = 2;
            } else {
                newState.p2Pos = [r, c];
                newState.turn = 1;
            }
            commitAction(newState);
        }
    };

    const handleWallClick = (r: number, c: number, type: "H" | "V") => {
        if (winner || isComputerThinking) return;

        const currentWalls = gameState.turn === 1 ? gameState.p1Walls : gameState.p2Walls;
        if (currentWalls === 0) return;

        const proposedWall: Wall = { r, c, type };
        if (isValidWallPlacement(gameState, proposedWall)) {
            const newState = { ...gameState, walls: [...gameState.walls, proposedWall] };
            if (gameState.turn === 1) {
                newState.p1Walls--;
                newState.turn = 2;
            } else {
                newState.p2Walls--;
                newState.turn = 1;
            }
            commitAction(newState);
        }
    };

    // AI Turn effect
    useEffect(() => {
        if (mode === "vs_computer" && gameState.turn === 2 && !winner) {
            setIsComputerThinking(true);
            const timer = setTimeout(() => {
                const action = getComputerAction(gameState);
                if (action) {
                    const newState = { ...gameState };
                    if (action.type === "move") {
                        newState.p2Pos = action.pos;
                    } else if (action.type === "wall") {
                        newState.walls = [...newState.walls, action.wall];
                        newState.p2Walls--;
                    }
                    newState.turn = 1;
                    commitAction(newState);
                }
                setIsComputerThinking(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [gameState, mode, winner, commitAction]);

    // RENDER HELPERS
    const renderCells = () => {
        const cells = [];
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const isP1 = r === gameState.p1Pos[0] && c === gameState.p1Pos[1];
                const isP2 = r === gameState.p2Pos[0] && c === gameState.p2Pos[1];
                const isMoveTarget = !winner && !isComputerThinking && validMoves.some(([vr, vc]) => vr === r && vc === c);

                cells.push(
                    <div
                        key={`cell-${r}-${c}`}
                        role="button"
                        tabIndex={isMoveTarget ? 0 : -1}
                        className={`w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-md shadow-sm flex items-center justify-center transition-colors shrink-0
                            ${isMoveTarget ? 'bg-primary/20 cursor-pointer hover:bg-primary/40 ring-2 ring-primary/50' : 'bg-content3'}
                        `}
                        style={{ gridRow: r * 2 + 1, gridColumn: c * 2 + 1 }}
                        onClick={() => handleCellClick(r, c)}
                        onKeyDown={(e) => {
                            if ((e.key === "Enter" || e.key === " ") && isMoveTarget) {
                                e.preventDefault();
                                handleCellClick(r, c);
                            }
                        }}
                    >
                        {/* Pawns */}
                        <AnimatePresence>
                            {isP1 && (
                                <motion.div
                                    layoutId="p1"
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className="w-3/4 h-3/4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg border-2 border-white/30 z-20"
                                />
                            )}
                            {isP2 && (
                                <motion.div
                                    layoutId="p2"
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className="w-3/4 h-3/4 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-lg border-2 border-white/30 z-20"
                                />
                            )}
                        </AnimatePresence>
                    </div>
                );
            }
        }
        return cells;
    };

    const renderGrooves = () => {
        const grooves = [];
        const hasWallsP1 = gameState.turn === 1 && gameState.p1Walls > 0;
        const hasWallsP2 = gameState.turn === 2 && gameState.p2Walls > 0;
        const canPlaceWall = !winner && !isComputerThinking && (gameState.turn === 1 ? hasWallsP1 : hasWallsP2) && !(mode === "vs_computer" && gameState.turn === 2);

        // Horizontal Grooves (between rows)
        for (let r = 0; r < BOARD_SIZE - 1; r++) {
            for (let c = 0; c < BOARD_SIZE - 1; c++) {
                // Interactive trigger zone spans the width of two adjacent cells
                grooves.push(
                    <div
                        key={`h-groove-${r}-${c}`}
                        role="button"
                        tabIndex={canPlaceWall ? 0 : -1}
                        className={`group z-10 shrink-0 ${canPlaceWall ? 'cursor-pointer' : ''}`}
                        style={{
                            gridRow: r * 2 + 2,
                            gridColumn: `${c * 2 + 1} / span 3`,
                        }}
                        onMouseEnter={() => canPlaceWall && setHoverWall({ r, c, type: "H" })}
                        onMouseLeave={() => setHoverWall(null)}
                        onKeyDown={(e) => {
                            if ((e.key === "Enter" || e.key === " ") && canPlaceWall && isValidWallPlacement(gameState, { r, c, type: "H" })) {
                                e.preventDefault();
                                handleWallClick(r, c, "H");
                            }
                        }}
                        onClick={() => {
                            if (canPlaceWall && isValidWallPlacement(gameState, { r, c, type: "H" })) {
                                handleWallClick(r, c, "H");
                            }
                        }}
                    >
                        <div className="w-full h-full min-h-[8px] sm:min-h-[12px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center py-1">
                            {/* Visual preview of full horizontal wall */}
                            {canPlaceWall && hoverWall?.r === r && hoverWall?.c === c && hoverWall?.type === "H" && isValidWallPlacement(gameState, { r, c, type: "H" }) && (
                                <div className="w-full h-2 sm:h-3 rounded bg-warning/50 pointer-events-none" />
                            )}
                        </div>
                    </div>
                );
            }
        }

        // Vertical Grooves (between cols)
        for (let r = 0; r < BOARD_SIZE - 1; r++) {
            for (let c = 0; c < BOARD_SIZE - 1; c++) {
                grooves.push(
                    <div
                        key={`v-groove-${r}-${c}`}
                        role="button"
                        tabIndex={canPlaceWall ? 0 : -1}
                        className={`group z-10 shrink-0 ${canPlaceWall ? 'cursor-pointer' : ''}`}
                        style={{
                            gridRow: `${r * 2 + 1} / span 3`,
                            gridColumn: c * 2 + 2,
                        }}
                        onMouseEnter={() => canPlaceWall && setHoverWall({ r, c, type: "V" })}
                        onMouseLeave={() => setHoverWall(null)}
                        onKeyDown={(e) => {
                            if ((e.key === "Enter" || e.key === " ") && canPlaceWall && isValidWallPlacement(gameState, { r, c, type: "V" })) {
                                e.preventDefault();
                                handleWallClick(r, c, "V");
                            }
                        }}
                        onClick={() => {
                            if (canPlaceWall && isValidWallPlacement(gameState, { r, c, type: "V" })) {
                                handleWallClick(r, c, "V");
                            }
                        }}
                    >
                        <div className="w-full h-full min-w-[8px] sm:min-w-[12px] opacity-0 group-hover:opacity-100 transition-opacity flex justify-center px-1">
                            {/* Visual preview of full vertical wall */}
                            {canPlaceWall && hoverWall?.r === r && hoverWall?.c === c && hoverWall?.type === "V" && isValidWallPlacement(gameState, { r, c, type: "V" }) && (
                                <div className="h-full w-2 sm:w-3 rounded bg-warning/50 pointer-events-none" />
                            )}
                        </div>
                    </div>
                );
            }
        }

        return grooves;
    };

    const renderPlacedWalls = () => {
        return gameState.walls.map((wall, idx) => {
            if (wall.type === "H") {
                return (
                    <motion.div
                        key={`placed-h-${idx}`}
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        className="bg-warning z-20 shrink-0 border border-warning-600 shadow-md flex items-center rounded-sm"
                        style={{
                            gridRow: wall.r * 2 + 2,
                            gridColumn: `${wall.c * 2 + 1} / span 3`,
                            transformOrigin: "left center"
                        }}
                    >
                        <div className="w-full h-2 sm:h-3 bg-gradient-to-b from-white/30 to-transparent" />
                    </motion.div>
                );
            } else {
                return (
                    <motion.div
                        key={`placed-v-${idx}`}
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        className="bg-warning z-20 shrink-0 border border-warning-600 shadow-md flex justify-center rounded-sm"
                        style={{
                            gridRow: `${wall.r * 2 + 1} / span 3`,
                            gridColumn: wall.c * 2 + 2,
                            transformOrigin: "top center"
                        }}
                    >
                        <div className="h-full w-2 sm:w-3 bg-gradient-to-r from-white/30 to-transparent" />
                    </motion.div>
                );
            }
        });
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-5xl mx-auto py-4">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between w-full items-center px-4 gap-4">
                <div className="flex flex-col items-start text-center sm:text-left">
                    <h2 className="text-3xl font-bold font-heading">Quoridor</h2>
                    <p className="text-sm text-default-500">Reach the opposite side. Place walls to completely disrupt your opponent.</p>
                </div>

                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-4 px-4 py-2 bg-content2 rounded-xl border border-divider">
                        <div className={`flex flex-col items-center min-w-[60px] ${gameState.turn === 1 ? 'opacity-100' : 'opacity-50'}`}>
                            <span className="text-xs font-bold text-blue-500">Player 1</span>
                            <span className="text-sm font-medium">{gameState.p1Walls} Walls</span>
                        </div>
                        <div className="w-px h-8 bg-divider" />
                        <div className={`flex flex-col items-center min-w-[60px] ${gameState.turn === 2 ? 'opacity-100' : 'opacity-50'}`}>
                            <span className="text-xs font-bold text-red-500">{mode === 'vs_computer' ? 'Computer' : 'Player 2'}</span>
                            <span className="text-sm font-medium">{gameState.p2Walls} Walls</span>
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
            <div className="h-8">
                {winner ? (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`text-2xl font-bold ${winner === 'Player 1' ? 'text-blue-500' : 'text-red-500'}`}>
                        {winner} Wins!
                    </motion.div>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Turn:</span>
                        <span className={`text-xl font-bold ${gameState.turn === 1 ? 'text-blue-500' : 'text-red-500'} ${isComputerThinking ? 'animate-pulse' : ''}`}>
                            {gameState.turn === 1 ? "Player 1" : (mode === "vs_computer" ? "Computer Thinking..." : "Player 2")}
                        </span>
                    </div>
                )}
            </div>

            {/* Board */}
            <div className="relative p-4 sm:p-6 bg-content1 rounded-3xl border-4 border-content3 shadow-2xl overflow-x-auto max-w-full">
                <div
                    className="grid"
                    style={{
                        // 17 columns/rows: 9 for cells, 8 for grooves between them
                        gridTemplateColumns: `repeat(${BOARD_SIZE - 1}, min-content 8px) min-content`,
                        gridTemplateRows: `repeat(${BOARD_SIZE - 1}, min-content 8px) min-content`,
                        rowGap: "0",
                        columnGap: "0"
                    }}
                >
                    {renderCells()}
                    {renderGrooves()}
                    {renderPlacedWalls()}
                </div>
            </div>
        </div>
    );
};
