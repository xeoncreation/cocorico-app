import confetti from 'canvas-confetti';
import { haptic } from './haptics';

export function celebrate(msVibrate = 20) {
  haptic(msVibrate);
  confetti({ particleCount: 60, spread: 45, origin: { y: 0.85 } });
}
