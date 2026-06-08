import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useFetch — generic data-fetching hook.
 *
 * @param {Function} fetchFn   — async function that returns an axios response
 * @param {Object}   options
 *   immediate  {boolean}  — run on mount (default: true)
 *   deps       {Array}    — extra dependency array values (default: [])
 *   onSuccess  {Function} — called with response data on success
 *   onError    {Function} — called with error on failure
 *
 * @returns { data, loading, error, refetch, reset }
 *
 * Example:
 *   const { data, loading, error, refetch } = useFetch(
 *     () => schemeAPI.getSchemes({ page: 1 }),
 *     { onSuccess: (d) => console.log(d) }
 *   );
 */
const useFetch = (fetchFn, options = {}) => {
  const {
    immediate = true,
    deps = [],
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  // Track if the component is still mounted to avoid state updates on unmounted components
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFn(...args);
      const result = response?.data?.data ?? response?.data ?? response;
      if (mountedRef.current) {
        setData(result);
        onSuccess?.(result);
      }
      return result;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong';
      if (mountedRef.current) {
        setError(message);
        onError?.(err);
      }
      throw err;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [fetchFn, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, refetch: execute, reset };
};

export default useFetch;
