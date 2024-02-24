import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useTitle } from "../hooks";
import { baseUrl } from "../services/job.service";

export const UpdateJob = ({title}) => {

    const params = useParams();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requisites: '',
        salary: '',
        availability: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const access_token = localStorage.getItem('access_token');

    useEffect(() => {
        async function fetchJobDetails() {
            try {
                const response = await axios.get(`${baseUrl}/positions/${params.id}/`,
                {
                    headers: {
                        Authorization: `Token ${access_token}`,
                    },
                }
            );
                const jobData = await response.data;
                setFormData(jobData);
            } catch (error) {
                console.error("Error fetching job details:", error);
            }
        }
        fetchJobDetails();
    }, [access_token, params.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name] : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${baseUrl}/positions/${params.id}/`, formData,
                {
                    headers: {
                        Authorization: `Token ${access_token}`,
                    },
                }
            );

            console.log('Job updated:', response.data);
            setSuccess("Job updated successfully");
            setError(null);
        } catch (error) {
            console.error('Error updating job: ', error);
            setError('Error updating job.');
        }
    };

    useTitle(title);

    return (
        <form className="p-4" onSubmit={handleSubmit}>
            <div className="mb-6">
                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">Job Title</label>
                <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-6">
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">Job Description</label>
                <textarea className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-6">
                <label htmlFor="requisites" className="block mb-2 text-sm font-medium text-gray-900">Job Requirements</label>
                <textarea className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id="requisites"
                    name="requisites"
                    rows="4"
                    value={formData.requisites}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-6">
                <label htmlFor="salary" className="block mb-2 text-sm font-medium text-gray-900">Salary</label>
                <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id="salary"
                    name="salary"
                    type="number"
                    value={formData.salary}
                    onChange={handleChange}
                required/>
            </div>

            <div className="mb-6">
                <label htmlFor="availability" className="block mb-2 text-sm font-medium text-gray-900">Date Available</label>
                <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id="availability"
                    name="availability"
                    type="date"
                    value={formData.availability}
                    onChange={handleChange}
                    required
                />
            </div>

            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Update Job</button>
            <div className="p-4">
                {success && <p className="text-sm text-center text-green-500">{success}</p>}
                {error && <p className="text-sm text-center text-red-500"> {error}</p>}
            </div>
        </form>
    )
}
