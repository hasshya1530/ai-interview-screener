jsimport { useEffect, useRef, useState } from "react";

export default function useTimer(initialTime = 60, isRunning) {
    const [time, setTime] = useState(initialTime);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime((prev) => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isRunning]);

    const reset = () => setTime(initialTime);

    return { time, reset, setTime };
}