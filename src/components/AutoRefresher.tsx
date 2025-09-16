'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export function AutoRefresher({ interval = 20000 }: { interval?: number }) {
  const router = useRouter();
  // useRef to hold the interval ID so it persists across renders without causing re-renders
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Function to start the timer
    const startTimer = () => {
      // Clear any existing timer before starting a new one
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
      // Set a new timer
      intervalIdRef.current = setInterval(() => {
        router.refresh();
      }, interval);
    };

    // Function to stop the timer
    const stopTimer = () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };

    // Function to handle the page's visibility changing
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTimer(); // Stop the timer if the page is hidden
      } else {
        startTimer(); // Start the timer if the page is visible
      }
    };

    // Start the timer initially
    startTimer();

    // Add an event listener to detect when the user switches tabs or navigates away
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // This is the main cleanup function that runs when the component is truly destroyed
    return () => {
      stopTimer(); // Ensure the timer is stopped
      document.removeEventListener('visibilitychange', handleVisibilityChange); // Clean up the listener
    };
  }, [router, interval]); // Dependencies remain the same

  // This component still renders nothing to the page
  return null;
}
