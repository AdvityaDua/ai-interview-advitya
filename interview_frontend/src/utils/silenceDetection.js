/**
 * Creates a timer to detect silence.
 * @param {Function} onSilence - Callback to execute when silence threshold is met.
 * @param {number} threshold - Time in ms to wait before triggering.
 * @returns {number} - The timer ID (to clear it if needed).
 */
export const createSilenceTimer = (onSilence, threshold = 1500) => {
    return setTimeout(() => {
        onSilence();
    }, threshold);
};
