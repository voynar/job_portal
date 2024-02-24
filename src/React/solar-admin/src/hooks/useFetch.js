import { useState, useEffect } from "react";

export const useFetch = (apiPath) => {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const url = `/positions/list`;

    useEffect(() => {
        async function fetchJobs() {
            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
        
                const json = await response.json();
                setData(json.results);
                setIsLoading(false);
            } catch (error) {
                setError(error.message);
                setIsLoading(false);
            }
        }
        fetchJobs();
    }, [url]);

    return { data, isLoading, error };
}


