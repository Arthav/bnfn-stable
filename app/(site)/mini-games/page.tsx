"use client";

import { useState } from "react";
import { ModeSelection, PlayMode } from "@/components/mini-games/mode-selection";
import { GameSelection } from "@/components/mini-games/game-selection";
import { TicTacGomoku } from "@/components/mini-games/tic-tac-gomoku";
import { Button } from "@nextui-org/button";
import { motion, AnimatePresence } from "framer-motion";

export default function MiniGamesPage() {
    const [selectedMode, setSelectedMode] = useState<PlayMode | null>(null);
    const [selectedGames, setSelectedGames] = useState<string[]>([]);
    const [step, setStep] = useState<"mode" | "game" | "play">("mode");

    const handleModeSelect = (mode: PlayMode) => {
        setSelectedMode(mode);
        setSelectedGames([]); // Reset games when mode changes
        setStep("game");
    };

    const getMaxSelections = () => {
        return selectedMode === "competition" ? 3 : 1;
    };

    const handleGameSelect = (gameId: string) => {
        setSelectedGames((prev) => {
            const isSelected = prev.includes(gameId);
            const maxSelections = getMaxSelections();

            if (isSelected) {
                return prev.filter((id) => id !== gameId);
            }

            if (prev.length < maxSelections) {
                return [...prev, gameId];
            }

            return prev;
        });
    };

    const handleStartGame = () => {
        if (selectedGames.length === getMaxSelections()) {
            setStep("play");
        }
    };

    return (
        <div className="w-full min-h-[80vh] flex flex-col items-center py-10 px-4 relative overflow-hidden">
            {/* Background blobs for aesthetics */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2" />

            {/* Header aligned mostly inside components, but title here for coherence if needed */}
            <div className="mb-12 text-center z-10">
                <h1 className="text-5xl md:text-6xl font-black tracking-tight font-heading uppercase">
                    Arcade <span className="text-primary">Lounge</span>
                </h1>
                <p className="text-xl text-default-500 mt-4 max-w-2xl mx-auto">
                    Challenge the computer, play with friends locally, or set up a multi-game tournament.
                </p>
            </div>

            <div className={`w-full z-10 relative transition-all duration-500 ${step === "play" ? "max-w-full px-2 lg:px-8 shrink-0" : "max-w-6xl"}`}>
                <AnimatePresence mode="wait">
                    {step === "mode" && (
                        <motion.div
                            key="mode-selection"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.4 }}
                        >
                            <ModeSelection selectedMode={selectedMode} onSelectMode={handleModeSelect} />
                        </motion.div>
                    )}

                    {step === "game" && selectedMode && (
                        <motion.div
                            key="game-selection"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col gap-8 items-center w-full"
                        >
                            <GameSelection
                                currentMode={selectedMode}
                                maxSelections={getMaxSelections()}
                                onSelectGame={handleGameSelect}
                                selectedGames={selectedGames}
                            />

                            <div className="flex gap-4 mt-8 w-full justify-center">
                                <Button
                                    variant="flat"
                                    size="lg"
                                    onClick={() => setStep("mode")}
                                    className="font-bold"
                                >
                                    Back
                                </Button>
                                <Button
                                    color="secondary"
                                    size="lg"
                                    className="font-bold shadow-lg shadow-secondary/40"
                                    isDisabled={selectedGames.length !== getMaxSelections()}
                                    onClick={handleStartGame}
                                >
                                    Start {selectedMode === "competition" ? "Tournament" : "Game"}
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === "play" && (
                        <motion.div
                            key="play-area"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="w-full flex justify-center items-center flex-col min-h-[80vh] bg-content1/50 rounded-3xl border border-divider p-2 sm:p-6"
                        >
                            {selectedGames.includes("tic-tac-toe") ? (
                                <TicTacGomoku
                                    mode={selectedMode!}
                                    onGameEnd={(winner) => console.log("Game over", winner)}
                                    onBack={() => setStep("game")}
                                />
                            ) : (
                                <>
                                    <h2 className="text-4xl font-black opacity-30 mb-4 animate-pulse">Coming Soon</h2>
                                    <p className="text-xl text-default-500 mb-8 max-w-lg text-center">
                                        The actual game logic for {selectedGames.join(', ')} in {selectedMode} mode will be implemented here soon!
                                    </p>
                                    <Button
                                        color="primary"
                                        variant="flat"
                                        onClick={() => setStep("game")}
                                    >{"< Go Back"}</Button>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
