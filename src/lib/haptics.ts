export const haptic = (ms = 30) => ('vibrate' in navigator ? navigator.vibrate(ms) : false);
