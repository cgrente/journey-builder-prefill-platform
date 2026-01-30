import { useState, useEffect } from 'react';
import type { BlueprintGraph } from '../model/types';
import { getBlueprintGraph } from '../api/getBlueprintGraph';

type Status = 'idle' | 'loading' | 'error' | 'success';

export function useBlueprintGraph() {
    const [status, setStatus] = useState<Status>("idle");
    const [data, setData] = useState<BlueprintGraph | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function run() {
            setStatus("loading");
            setError(null);

            try {
                const graph = await getBlueprintGraph();
                if (cancelled) 
                    return;

                setData(graph);
                setStatus("success");
            } catch (err) {
                if (cancelled) 
                    return;

                const message = 
                    err instanceof Error ? err.message : "Unknown error";
                
                setError(message);
                setStatus("error");
            }
        }

        run();

        return () => {
            cancelled = true;
        };
    }, []);

    return {
        data,
        status,
        isLoading: status === "idle" || status === "loading",
        error
    }
}
