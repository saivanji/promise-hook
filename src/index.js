import { useState, useEffect } from "react";

export const usePromise = (fn, { resolve = false, condition = [] } = {}) => {
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(resolve);
  const [lastUpdated, setLastUpdated] = useState();
  const [error, setError] = useState();

  const request = async () => {
    setLoading(true);

    try {
      const result = await fn();

      setData(result);
      setLastUpdated(Date.now());
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (resolve) {
    useEffect(request, condition);
  }

  return {
    request,
    data,
    isLoading,
    lastUpdated,
    error
  };
};
