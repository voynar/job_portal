import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components';
import '../App.css';

export const ApplyToday = () => {

    const [error, setError] = useState(null);
    const [resumeError, setResumeError] = useState('');
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        message: '',
        resume: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (event) => {
        setFormData({ ...formData, resume: event.target.files[0] });
    };

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('first_name', formData.first_name);
            formDataToSend.append('last_name', formData.last_name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('message', formData.message);
            formDataToSend.append('resume', formData.resume);

            const response = await axios.post(`/send-mail.php`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Response from backend:', response.data);

            if (response.data.success) {
                setError(null);
                navigate('/job/success');
                console.log('Email sent successfully');
            } else {
                if (response.data.errors && response.data.errors.resume) {
                    setResumeError(response.data.errors.resume);
                }
                setError('Error', response.data);
                console.log('Error sending email');
            }

        } catch (error) {
            console.error('Form submission error: ', error);
        }
    };

    return (
        <main>
            <form onSubmit={handleSubmit} className="p-4">
                <div className="md:grid-cols-2 md:gap-6">
                    <div className="mb-6">
                        <input className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            value={formData.first_name}
                            onChange={handleChange}
                            type="text"
                            name="first_name"
                            id="first_name"
                            placeholder=" "
                            required
                        />
                        <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900">First name</label>
                    </div>

                    <div className="mb-6">
                        <input className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            value={formData.last_name}
                            onChange={handleChange}
                            type="text"
                            name="last_name"
                            id="last_name"
                            placeholder=" "
                            required
                        />
                        <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900">Last name</label>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="mb-6">
                        <input className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            value={formData.phone}
                            onChange={handleChange}
                            type="tel"
                            name="phone"
                            id="phone"
                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                            placeholder=" "
                            required
                        />
                        <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900">Phone number (123-456-7890)</label>
                    </div>

                    <div className="mb-6">
                        <input className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            name="email"
                            id="email"
                            placeholder=" "
                            required
                        />
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                    </div>
                </div>

                <div className="mb-6">
                    <input className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        value={formData.message}
                        onChange={handleChange}
                        type="text"
                        name="message"
                        id="message"
                        placeholder=" "
                        required
                    />
                    <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">Short Bio</label>
                </div>
                <div>
                    <span>
                        <Button type="submit">Submit</Button>
                    </span>
                </div>
                
                <div>
                    {error && <p className="text-sm text-center text-red-500"> {error}</p>}
                    {resumeError && <p className="text-sm text-center text-red-500">{resumeError}</p>}
                </div>

                <div className="mt-8">
                    <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="resume">Resume</label>
                    <input className="block w-full text-sm text-black border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                        type="file"
                        name="resume"
                        id="resume"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        required
                    />
                </div>
            </form>
        </main>
    );
};


