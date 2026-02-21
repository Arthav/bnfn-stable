import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { motion } from "framer-motion";

export type PlayMode = "vs_computer" | "vs_player" | "competition";

interface ModeSelectionProps {
    selectedMode: PlayMode | null;
    onSelectMode: (mode: PlayMode) => void;
}

const modes: { id: PlayMode; title: string; description: string }[] = [
    {
        id: "vs_computer",
        title: "Vs Computer",
        description: "Play single-player games against an AI opponent.",
    },
    {
        id: "vs_player",
        title: "Vs Player",
        description: "Play local multiplayer games against a friend on the same device.",
    },
    {
        id: "competition",
        title: "Competition Mode",
        description: "Select 3 games and play them in a Best-of-3 series against a friend locally.",
    },
];

export const ModeSelection = ({ selectedMode, onSelectMode }: ModeSelectionProps) => {
    return (
        <div className="w-full flex flex-col gap-6">
            <div className="text-center">
                <h2 className="text-3xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Select Game Mode
                </h2>
                <p className="text-default-500 mt-2">Choose how you want to play</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {modes.map((mode) => (
                    <motion.div
                        key={mode.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="h-full"
                    >
                        <Card
                            isHoverable
                            isPressable
                            className={`h-full border-2 transition-colors ${selectedMode === mode.id
                                    ? "border-primary bg-primary/10"
                                    : "border-transparent bg-content1"
                                }`}
                            onClick={() => onSelectMode(mode.id)}
                        >
                            <CardBody className="flex flex-col items-center text-center p-8 gap-4">
                                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl">
                                    {mode.title.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{mode.title}</h3>
                                    <p className="text-sm text-default-500 mt-2">{mode.description}</p>
                                </div>
                            </CardBody>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
