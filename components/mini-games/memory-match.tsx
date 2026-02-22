"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@nextui-org/button";
import { motion, AnimatePresence } from "framer-motion";
import {
    CardState,
    GameMode,
    createDeck,
    checkMatch,
    AIMemory,
} from "./memory-match-logic";

interface MemoryMatchProps {
    mode: GameMode;
    onGameEnd: (winner: string | "draw") => void;
    onBack?: () => void;
}

export const MemoryMatch = ({ mode, onGameEnd, onBack }: MemoryMatchProps) => {
    const [cards, setCards] = useState<CardState[]>(createDeck());
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1); // Player 1 vs Player 2/Computer
    const [scores, setScores] = useState({ 1: 0, 2: 0 });
    const [isChecking, setIsChecking] = useState(false);

    // AI specific state
    const [aiMemory, setAiMemory] = useState<AIMemory>({});

    const resetGame = () => {
        setCards(createDeck());
        setFlippedIndices([]);
        setCurrentPlayer(1);
        setScores({ 1: 0, 2: 0 });
        setIsChecking(false);
        setAiMemory({});
    };

    const handleMatch = (idx1: number, idx2: number) => {
        setIsChecking(true);

        const card1 = cards[idx1];
        const card2 = cards[idx2];
        const isMatch = checkMatch(card1, card2);

        // Learn for AI
        setAiMemory((prev) => ({
            ...prev,
            [idx1]: card1.symbol,
            [idx2]: card2.symbol,
        }));

        setTimeout(() => {
            if (isMatch) {
                // Update match state
                const newCards = [...cards];
                newCards[idx1].isMatched = true;
                newCards[idx2].isMatched = true;
                setCards(newCards);

                // Add score to current player
                setScores((prev) => ({ ...prev, [currentPlayer]: prev[currentPlayer] + 1 }));

                // Check win condition (all matched?)
                if (newCards.every(c => c.isMatched)) {
                    const finalScores = { ...scores, [currentPlayer]: scores[currentPlayer] + 1 };
                    let winnerStr: string | "draw" = "draw";

                    if (finalScores[1] > finalScores[2]) {
                        winnerStr = "Player 1";
                    } else if (finalScores[2] > finalScores[1]) {
                        winnerStr = mode === "vs_computer" ? "Computer" : "Player 2";
                    }
                    onGameEnd(winnerStr);
                }

                // If match, player gets to keep their turn! 
                // Wait for AI if computer matched
            } else {
                // Mismatch, unflip cards
                const newCards = [...cards];
                newCards[idx1].isFlipped = false;
                newCards[idx2].isFlipped = false;
                setCards(newCards);

                // Switch turn
                setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
            }

            setFlippedIndices([]);
            setIsChecking(false);
        }, 1000);
    };

    const handleCardClick = (index: number) => {
        if (isChecking) return; // Prevent clicking while evaluating
        if (cards[index].isFlipped || cards[index].isMatched) return; // Can't select already flipped
        if (mode === "vs_computer" && currentPlayer === 2) return; // Block input during AI turn

        const newCards = [...cards];
        newCards[index].isFlipped = true;
        setCards(newCards);

        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);

        if (newFlipped.length === 2) {
            handleMatch(newFlipped[0], newFlipped[1]);
        }
    };

    // AI Turn Logic
    useEffect(() => {
        if (mode === "vs_computer" && currentPlayer === 2 && !isChecking && cards.some(c => !c.isMatched)) {
            // Need a tiny delay between first and second flip for realism
            setIsChecking(true);

            const aiTurnDelay = setTimeout(() => {
                const getUnknownIndices = () => cards.map((c, i) => !c.isFlipped && !c.isMatched && !(i in aiMemory) ? i : -1).filter(i => i !== -1);
                const getUnmatchedIndices = () => cards.map((c, i) => !c.isFlipped && !c.isMatched ? i : -1).filter(i => i !== -1);

                let flipIndex = -1;

                // 1. If we have flipped one card already this turn:
                if (flippedIndices.length === 1) {
                    const firstIdx = flippedIndices[0];
                    const firstSymbol = cards[firstIdx].symbol;

                    // Do we know the match anywhere in memory?
                    const matchIdxStr = Object.keys(aiMemory).find(
                        k => aiMemory[parseInt(k)] === firstSymbol && parseInt(k) !== firstIdx && !cards[parseInt(k)].isMatched
                    );

                    if (matchIdxStr) {
                        flipIndex = parseInt(matchIdxStr);
                    } else {
                        // Guess randomly among *unknown* cards to avoid wasting a turn flipping a known non-match
                        const unknown = getUnknownIndices();
                        if (unknown.length > 0) {
                            flipIndex = unknown[Math.floor(Math.random() * unknown.length)];
                        } else {
                            // Only known cards left, but not matches. Just flip next available.
                            const unmatched = getUnmatchedIndices();
                            flipIndex = unmatched[Math.floor(Math.random() * unmatched.length)];
                        }
                    }
                }
                // 2. If this is the FIRST flip of the turn:
                else if (flippedIndices.length === 0) {
                    // Do we know ANY pair?
                    const symbolCounts: Record<string, number[]> = {};
                    for (const [idxStr, symbol] of Object.entries(aiMemory)) {
                        const idx = parseInt(idxStr);
                        if (!cards[idx].isMatched) {
                            if (!symbolCounts[symbol]) symbolCounts[symbol] = [];
                            symbolCounts[symbol].push(idx);
                        }
                    }

                    const knownPair = Object.values(symbolCounts).find(arr => arr.length >= 2);

                    if (knownPair) {
                        // Flip the first card of the known pair
                        flipIndex = knownPair[0];
                    } else {
                        // Pick a random unknown card
                        const unknown = getUnknownIndices();
                        if (unknown.length > 0) {
                            flipIndex = unknown[Math.floor(Math.random() * unknown.length)];
                        } else {
                            // Only known unmatched cards left. Pick one.
                            const unmatched = getUnmatchedIndices();
                            if (unmatched.length > 0) {
                                flipIndex = unmatched[Math.floor(Math.random() * unmatched.length)];
                            }
                        }
                    }
                }

                if (flipIndex !== -1) {
                    const newCards = [...cards];
                    newCards[flipIndex].isFlipped = true;
                    setCards(newCards);

                    const newFlipped = [...flippedIndices, flipIndex];
                    // Immediate memory update
                    setAiMemory(prev => ({ ...prev, [flipIndex]: newCards[flipIndex].symbol }));

                    if (newFlipped.length === 2) {
                        handleMatch(newFlipped[0], newFlipped[1]);
                    } else {
                        setFlippedIndices(newFlipped);
                        setIsChecking(false);
                    }
                }
            }, 800); // 800ms delay between AI actions

            return () => clearTimeout(aiTurnDelay);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPlayer, isChecking, flippedIndices, cards, mode, aiMemory]);


    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-5xl mx-auto py-4">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between w-full items-center px-4 gap-4">
                <div className="flex flex-col items-start text-center sm:text-left">
                    <h2 className="text-3xl font-bold font-heading">Memory Match</h2>
                    <p className="text-sm text-default-500">Find pairs. A correct match gets you another turn!</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="flex items-center gap-4 px-4 py-2 bg-content2 rounded-xl border border-divider">
                        <div className={`font-bold ${currentPlayer === 1 ? 'text-primary' : 'text-default-500'}`}>
                            P1: {scores[1]}
                        </div>
                        <div className="w-px h-6 bg-divider" />
                        <div className={`font-bold ${currentPlayer === 2 ? 'text-secondary' : 'text-default-500'}`}>
                            {mode === "vs_computer" ? "AI: " : "P2: "}{scores[2]}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {onBack && (
                            <Button size="sm" variant="bordered" onClick={onBack}>
                                Back
                            </Button>
                        )}
                        <Button size="sm" color="primary" variant="flat" onClick={resetGame}>
                            Restart
                        </Button>
                    </div>
                </div>
            </div>

            {/* Turn Announcer */}
            <div className="h-8">
                {cards.every(c => c.isMatched) ? (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-2xl font-bold text-success">
                        {scores[1] > scores[2] ? "Player 1 Wins!" : scores[2] > scores[1] ? (mode === "vs_computer" ? "Computer Wins!" : "Player 2 Wins!") : "It's a Draw!"}
                    </motion.div>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Turn:</span>
                        <span className={`text-xl font-bold ${currentPlayer === 1 ? 'text-primary' : 'text-secondary'} ${isChecking && mode === "vs_computer" && currentPlayer === 2 ? 'animate-pulse' : ''}`}>
                            {currentPlayer === 1 ? "Player 1" : (mode === "vs_computer" ? "Computer" : "Player 2")}
                        </span>
                    </div>
                )}
            </div>

            {/* Game Board Container */}
            <div className="w-full max-w-3xl flex-1 bg-content1/50 rounded-3xl shadow-inner border border-divider p-4 sm:p-8">
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 sm:gap-4 mx-auto place-items-center">
                    {cards.map((card, index) => (
                        <div
                            key={card.id}
                            className="relative w-full aspect-[3/4] cursor-pointer"
                            onClick={() => handleCardClick(index)}
                            role="button"
                            tabIndex={!card.isMatched && !card.isFlipped && !(mode === "vs_computer" && currentPlayer === 2) ? 0 : -1}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    handleCardClick(index);
                                }
                            }}
                        >
                            <motion.div
                                className="w-full h-full relative preserve-3d"
                                animate={{ rotateY: card.isFlipped ? 180 : 0 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                {/* Front of card (Icon) */}
                                <div
                                    className={`absolute inset-0 backface-hidden flex items-center justify-center rounded-xl sm:rounded-2xl border-2 text-4xl sm:text-6xl
                                        ${card.isMatched ? 'bg-success/20 border-success shadow-[0_0_15px_rgba(var(--nextui-success),0.3)]' : 'bg-content2 border-primary/50'}
                                    `}
                                    style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
                                >
                                    {card.isFlipped ? card.symbol : ""}
                                </div>

                                {/* Back of card (Pattern) */}
                                <div
                                    className={`absolute inset-0 backface-hidden bg-gradient-to-br from-primary to-secondary rounded-xl sm:rounded-2xl border-2 border-white/20 shadow-lg flex items-center justify-center
                                        ${!isChecking && !card.isFlipped && !(mode === "vs_computer" && currentPlayer === 2) ? 'hover:scale-105 hover:shadow-primary/40' : ''} transition-transform
                                    `}
                                    style={{ backfaceVisibility: "hidden" }}
                                >
                                    <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-white/30 rounded-full flex items-center justify-center">
                                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white/50 rounded-full" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
