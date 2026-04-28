"use client";

import { useState, useEffect } from "react";

/**
 * Generic data fetcher with fallback.
 * Tries to fetch from API, falls back to provided default data.
 */
export function useApiData<T>(
  fetcher: () => Promise<T>,
  fallback: T
): { data: T; loading: boolean; error: boolean } {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetcher()
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error };
}

/**
 * Fetch paginated results, return just the results array.
 */
export function useApiList<T>(
  fetcher: () => Promise<{ results: T[] }>,
  fallback: T[]
): { data: T[]; loading: boolean } {
  const [data, setData] = useState<T[]>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetcher()
      .then((result) => {
        if (!cancelled && result.results?.length > 0) {
          setData(result.results);
          setLoading(false);
        } else if (!cancelled) {
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading };
}
