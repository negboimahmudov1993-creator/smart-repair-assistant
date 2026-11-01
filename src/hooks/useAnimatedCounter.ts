import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to smoothly animate numbers from 0 (or previous value) to target value.
 * Uses requestAnimationFrame with cubic ease-out for native 60fps/120fps smoothness.
 */
export function useAnimatedCounter(targetValue: number, duration: number = 800): number {
  const [currentValue, setCurrentValue] = useState<number>(0);
  const startValRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    // If target is 0 or NaN, quickly set to 0
    if (isNaN(targetValue) || targetValue <= 0) {
      setCurrentValue(0);
      startValRef.current = 0;
      return;
    }

    const startVal = startValRef.current;
    const change = targetValue - startVal;

    // Cubic ease out: 1 - Math.pow(1 - t, 3)
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      const nextVal = Math.round(startVal + change * easedProgress);
      setCurrentValue(nextVal);

      if (progress < 1) {
        animFrameIdRef.current = requestAnimationFrame(step);
      } else {
        setCurrentValue(targetValue);
        startValRef.current = targetValue;
        startTimeRef.current = null;
      }
    };

    startTimeRef.current = null;
    animFrameIdRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [targetValue, duration]);

  return currentValue;
}
