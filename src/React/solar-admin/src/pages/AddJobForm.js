import { useState, useEffect } from "react";
import axios from "axios";
import { useTitle } from "../hooks";
import {  useNavigate } from "react-router-dom";
import { baseUrl } from "../services/job.service";

export const AddJobForm = ({title}) => {

    useEffect(() => {
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    }, []);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requisites: '',
        salary: '',
        availability: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name] : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const access_token = localStorage.getItem('access_token');
            const response = await axios.post(`${baseUrl}/positions/list/`, formData,
                {
                    headers: {
                        Authorization: `Token ${access_token}`,
                    },
                }
            );

            console.log('Job posted:', response.data);
            setFormData({
                title: '',
                description: '',
                requisites: '',
                salary: '',
                availability: '',
            });
            setError(null);
            setSuccess(null);
            navigate("/");
        } catch (error) {
            console.error('Error adding job: ', error);
            setError('Error adding job.');
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
            <div className="mb-6">
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add Job</button>
            </div>
            {success && <p className="success-message">{success}</p>}
            {error && <p className="error-message">{error}</p>}
        </form>
    )
}
