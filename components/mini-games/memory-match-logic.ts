export type GameMode = "vs_computer" | "vs_player" | "competition";

export interface CardState {
    id: number;
    symbol: string;
    isFlipped: boolean;
    isMatched: boolean;
}

// Emojis or simple symbols for pairs
const SYMBOLS = [
    "🚀", "🍕", "🎮", "🎸", "🌟", "🔥", "💎", "🔮",
    "🎧", "🍔"
];

const totalPairsCount = 10; // 20 cards total (4x5 grid or 5x4)

export const createDeck = (): CardState[] => {
    // Select the symbols we need
    const selectedSymbols = SYMBOLS.slice(0, totalPairsCount);
    const initialDeck: CardState[] = [];

    // Duplicate each symbol to make pairs
    selectedSymbols.forEach((symbol, index) => {
        initialDeck.push({ id: index * 2, symbol, isFlipped: false, isMatched: false });
        initialDeck.push({ id: index * 2 + 1, symbol, isFlipped: false, isMatched: false });
    });

    // Fisher-Yates shuffle
    for (let i = initialDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [initialDeck[i], initialDeck[j]] = [initialDeck[j], initialDeck[i]];
    }

    return initialDeck;
};

export const checkMatch = (card1: CardState, card2: CardState): boolean => {
    return card1.symbol === card2.symbol;
};

// AI Memory State
export type AIMemory = {
    [index: number]: string; // index in the cards array -> symbol
};

/**
 * Given the current cards and what the AI remembers, figure out the next best move.
 * The AI needs to return the *index* of the card to flip.
 * 
 * If it's the first flip of the turn (firstCardIndex === null):
 * 1. Look for known pairs in memory. If found, pick the first one.
 * 2. Otherwise, pick a random unflipped, unknown card.
 * 
 * If it's the second flip of the turn (firstCardIndex !== null):
 * 1. Check if the match for firstCardIndex is in memory. If so, pick it.
 * 2. Otherwise, pick a random unflipped, unknown card.
 */
export const getComputerFlip = (
    cards: CardState[],
    memory: AIMemory,
    firstCardIndex: number | null
): number => {
    const unflippedIndices = cards
        .map((c, i) => (!c.isFlipped && !c.isMatched ? i : -1))
        .filter((i) => i !== -1);

    // Safety check
    if (unflippedIndices.length === 0) return -1;

    // Remove the currently flipped first card from our options for the second flip
    const availableIndices = firstCardIndex !== null
        ? unflippedIndices.filter(i => i !== firstCardIndex)
        : unflippedIndices;

    if (availableIndices.length === 0) return -1;

    // Helper to find pairs in memory that haven't been matched yet
    const getKnownPairs = (): [number, number] | null => {
        const symbolToIndices: Record<string, number[]> = {};
        for (const [idxStr, symbol] of Object.entries(memory)) {
            const idx = parseInt(idxStr);
            if (!cards[idx].isMatched && !cards[idx].isFlipped) {
                if (!symbolToIndices[symbol]) {
                    symbolToIndices[symbol] = [];
                }
                symbolToIndices[symbol].push(idx);
            }
        }

        // Return the first valid pair we find
        for (const indices of Object.values(symbolToIndices)) {
            if (indices.length >= 2) {
                return [indices[0], indices[1]];
            }
        }
        return null;
    };

    // --- SECOND FLIP LOGIC ---
    if (firstCardIndex !== null) {
        const targetSymbol = cards[firstCardIndex].symbol;

        // Do we know where the match is?
        for (const [idxStr, symbol] of Object.entries(memory)) {
            const idx = parseInt(idxStr);
            if (
                symbol === targetSymbol &&
                idx !== firstCardIndex &&
                !cards[idx].isMatched &&
                !cards[idx].isFlipped
            ) {
                return idx; // Found the match!
            }
        }

        // Match not in memory. Pick a random completely unknown card.
        const unknownIndices = availableIndices.filter(i => !(i in memory));
        if (unknownIndices.length > 0) {
            return unknownIndices[Math.floor(Math.random() * unknownIndices.length)];
        }

        // If all available cards are in memory (but aren't the match), just pick one
        return availableIndices[Math.floor(Math.random() * availableIndices.length)];
    }

    // --- FIRST FLIP LOGIC ---
    // Do we have any known pairs in memory?
    const knownPair = getKnownPairs();
    if (knownPair) {
        return knownPair[0]; // Flip the first half of the pair
    }

    // We don't know any pairs. Pick a random unknown card.
    const unknownIndices = availableIndices.filter(i => !(i in memory));
    if (unknownIndices.length > 0) {
        return unknownIndices[Math.floor(Math.random() * unknownIndices.length)];
    }

    return availableIndices[Math.floor(Math.random() * availableIndices.length)];
};
