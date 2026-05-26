export function getMaxGameSelections(mode: string | null) {
  return mode === "competition" ? 3 : 1;
}

export function toggleSelectedGame(
  selectedGames: string[],
  gameId: string,
  maxSelections: number
) {
  if (selectedGames.includes(gameId)) {
    return selectedGames.filter((id) => id !== gameId);
  }

  if (maxSelections === 1) {
    return [gameId];
  }

  if (selectedGames.length < maxSelections) {
    return [...selectedGames, gameId];
  }

  return selectedGames;
}

export function restoreUndoSnapshot<T>(history: T[], popCount: number) {
  if (history.length === 0) return { snapshot: undefined, history };

  const actualPopCount = Math.min(popCount, history.length);
  return {
    snapshot: history[history.length - actualPopCount],
    history: history.slice(0, history.length - actualPopCount),
  };
}
