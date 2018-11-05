import { useState, useEffect } from "react";

export const usePromise = (
  fn,
  { resolve = false, resolveCondition = [] } = {}
) => {
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(resolve);
  const [lastUpdated, setLastUpdated] = useState();
  const [error, setError] = useState();

  const request = async (...args) => {
    /*
    Using isValid guard, in order to prevent the cleanup warning.
    */
    let isValid = true;
    setLoading(true);

    try {
      if (!isValid) return;

      const result = await fn(...args);

      setData(result);
      setLastUpdated(Date.now());
    } catch (err) {
      if (!isValid) return;

      setError(err);
    } finally {
      if (!isValid) return;

      setLoading(false);
    }

    /*
    When component will be unmounted, isValid will become false and state setter
    functions will not be envoked on unmounted component.
    */
    return () => {
      isValid = false;
    };
  };

  if (resolve) {
    useEffect(request, resolveCondition);
  }

  return {
    request,
    data,
    isLoading,
    lastUpdated,
    error
  };
};
