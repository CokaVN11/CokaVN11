// ABOUTME: Hook to load guest name from CSV file using URL token parameter
// ABOUTME: Returns null if token not found or not provided (hides invitation quote)

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface UseGuestNameResult {
  /** Guest name if found, null otherwise */
  guestName: string | null;
  /** Whether CSV is still loading */
  isLoading: boolean;
  /** Error if CSV fetch failed */
  error: Error | null;
}

/**
 * Hook to lookup guest name from CSV by URL token
 *
 * Usage: Add `?token=abc123` to URL to show personalized invitation
 * - If token found in CSV: returns guest name
 * - If token not found or missing: returns null (quote hidden)
 */
export function useGuestName(): UseGuestNameResult {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [guestName, setGuestName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // No token provided - skip CSV fetch
    if (!token) {
      setIsLoading(false);
      setGuestName(null);
      return;
    }

    async function fetchGuestName() {
      try {
        const response = await fetch('/guests.csv');

        if (!response.ok) {
          throw new Error(`Failed to fetch guests.csv: ${response.status}`);
        }

        const csvText = await response.text();
        const lines = csvText.trim().split('\n');

        // Skip header row, parse remaining lines
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // Simple CSV parsing (assumes no commas in names)
          const commaIndex = line.indexOf(',');
          if (commaIndex === -1) continue;

          const csvToken = line.substring(0, commaIndex).trim();
          const csvName = line.substring(commaIndex + 1).trim();

          if (csvToken === token) {
            setGuestName(csvName);
            setIsLoading(false);
            return;
          }
        }

        // Token not found in CSV
        setGuestName(null);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading guests.csv:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setGuestName(null);
        setIsLoading(false);
      }
    }

    fetchGuestName();
  }, [token]);

  return { guestName, isLoading, error };
}
