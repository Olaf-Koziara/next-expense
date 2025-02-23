import {use, useCallback, useState} from "react";

type StatusType = "idle" | "pending" | "success" | "error";

interface StatusState {
    status: StatusType;
    error: Error | null;
    message: string;
    isLoading: boolean;
}

const useStatus = () => {
    const [state, setState] = useState<StatusState>({
        status: "idle",
        error: null,
        message: "",
        isLoading: false,
    });

    const setStatus = useCallback((status: StatusType) => {
        setState((prevState) => ({...prevState, status, isLoading: status === 'pending'}))

    }, [])
    const setMessage = useCallback((message: string) => {
        setState((prevState) => ({...prevState, message}))
    }, [])

    return {
        status: state.status,
        error: state.error,
        message: state.message,
        isLoading: state.isLoading,
        setStatus,
        setMessage,

    };
};

export default useStatus;