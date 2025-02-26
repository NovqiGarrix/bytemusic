import { useEffect, useRef } from 'react';

/**
 * A hook that calls a callback when a value reaches a target within a timeout period.
 * Useful for ensuring loading progress completes even when stuck near 100%.
 */
export function useLoadingComplete({
    currentValue,
    targetValue,
    threshold = 95,
    timeout = 3000,
    onComplete
}: {
    currentValue: number;
    targetValue: number;
    threshold?: number;
    timeout?: number;
    onComplete: () => void;
}) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // If we've reached the threshold but not the target, start a timeout
        if (currentValue >= threshold && currentValue < targetValue) {
            // Clear any existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Set a new timeout to force completion
            timeoutRef.current = setTimeout(() => {
                onComplete();
                timeoutRef.current = null;
            }, timeout);
        }
        // If we've reached the target, clear the timeout
        else if (currentValue >= targetValue) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        }

        // Clean up on unmount
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [currentValue, targetValue, threshold, timeout, onComplete]);
}
