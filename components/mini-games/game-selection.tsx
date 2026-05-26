import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { motion } from "framer-motion";
import { getGamesForMode } from "@/components/mini-games/registry";
import { PlayMode } from "@/components/mini-games/types";

interface GameSelectionProps {
  selectedGames: string[];
  onSelectGame: (gameId: string) => void;
  maxSelections: number;
  currentMode: PlayMode;
}

export const GameSelection = ({
  selectedGames,
  onSelectGame,
  maxSelections,
  currentMode,
}: GameSelectionProps) => {
  const filteredGames = getGamesForMode(currentMode);

  return (
    <div className="w-full flex justify-center flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
          Select {maxSelections > 1 ? `Games (${selectedGames.length}/${maxSelections})` : "Game"}
        </h2>
        <p className="text-default-500 mt-2">
          {maxSelections > 1
            ? `Please select exactly ${maxSelections} games for competition mode.`
            : "Choose a game to play."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {filteredGames.map((game) => {
          const isSelected = selectedGames.includes(game.id);
          const isDisabled =
            !isSelected && selectedGames.length >= maxSelections && maxSelections > 1;

          return (
            <motion.div
              key={game.id}
              whileHover={{ scale: isDisabled ? 1 : 1.05 }}
              whileTap={{ scale: isDisabled ? 1 : 0.95 }}
              className={`h-full ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <Card
                isHoverable={!isDisabled}
                isPressable={!isDisabled}
                className={`h-full border-2 transition-all duration-300 ${
                  isSelected
                    ? "border-secondary scale-105 shadow-xl shadow-secondary/20"
                    : "border-default-200 hover:border-default-400"
                }`}
                onClick={() => {
                  if (!isDisabled || isSelected) {
                    onSelectGame(game.id);
                  }
                }}
              >
                <CardBody className="p-0 overflow-hidden relative group h-48 bg-default-100 flex items-center justify-center">
                  {game.imageUrl ? (
                    <img
                      src={game.imageUrl}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="text-6xl group-hover:scale-110 transition-transform duration-500">
                      Game
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute inset-0 bg-secondary/10 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        OK
                      </div>
                    </div>
                  )}
                </CardBody>
                <CardFooter className="flex-col items-start gap-1 p-4">
                  <h4 className="font-bold text-lg">{game.title}</h4>
                  <p className="text-sm text-default-500 line-clamp-2">
                    {game.description}
                  </p>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
