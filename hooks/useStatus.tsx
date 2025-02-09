import {useCallback, useState} from "react";

const useStatus = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const startLoading = useCallback(() => setIsLoading(true), []);
    const stopLoading = useCallback(() => setIsLoading(false), []);
    const resetError = useCallback(() => setError(null), []);
    const setErrorState = useCallback((err: Error) => setError(err), []);

    return {
        isLoading,
        error,
        startLoading,
        stopLoading,
        resetError,
        setErrorState,
    };
};

export default useStatus;
