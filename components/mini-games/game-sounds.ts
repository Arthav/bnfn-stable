// Programmatic sound effects using Web Audio API

let audioCtx: AudioContext | null = null;

const getCtx = (): AudioContext => {
    if (!audioCtx) audioCtx = new AudioContext();
    return audioCtx;
};

/** Short "click/pop" for placing a marble */
export const playPlaceSound = () => {
    try {
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = "sine";
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.12);
    } catch { /* silent fail */ }
};

/** Whoosh sound for the orbital shift */
export const playShiftSound = () => {
    try {
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = "sine";
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.25);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.4);

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
    } catch { /* silent fail */ }
};

/** Rewind sound for undo */
export const playUndoSound = () => {
    try {
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = "triangle";
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
    } catch { /* silent fail */ }
};

/** Victory fanfare — three ascending tones */
export const playWinSound = () => {
    try {
        const ctx = getCtx();
        const notes = [523, 659, 784]; // C5, E5, G5

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = "sine";
            const start = ctx.currentTime + i * 0.15;
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.15, start + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

            osc.start(start);
            osc.stop(start + 0.35);
        });
    } catch { /* silent fail */ }
};
