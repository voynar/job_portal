import { Link } from "react-router-dom";

export const Card = ({job}) => {
    // title, description, requisites, availability, salary
    const {id} = job;

    return (
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-3">
            <Link to={`/job/${id}`}>
                <img className="rounded-t-lg" alt="" />
            </Link>
            <div className="p-5">
                <Link to={`/job/${id}`}>
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{job.title}</h5>
                </Link>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{job.description}</p>
            </div>
        </div>
    )
}





