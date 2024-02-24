import { useEffect, useState } from 'react';
import { useTitle } from '../hooks';
import { Card } from '../components';
import { baseUrl } from '../services/job.service';

export const JobHome = ({title}) => {

    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        async function fetchJobs() {
            const response = await fetch(`${baseUrl}/positions/list/`);
            const data = await response.json();
            setJobs(data);
        }
        fetchJobs();
    }, []);

    useTitle(title);

    return (
        <main>
            <style>{`
                body {
                    background-color: #374151;
                }
            `}
            </style>
            <section className="max-w-7xl mx-auto py-7">
                <div className="flex justify-start flex-wrap justify-evenly">
                    {jobs.map((job) => (
                        <Card key={job.id} job={job} />
                    ))}
                </div>
            </section>
        </main>
    )
}


