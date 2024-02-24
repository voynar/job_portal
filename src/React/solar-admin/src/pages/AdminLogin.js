import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios";
import UserContext from "../components/UserContext";
import { Button } from "../components";
import Logo from "../assets/logo.png";
import { useTitle } from "../hooks";
import { baseUrl } from "../services/job.service";

export const AdminLogin = ({title}) => {
    // Using a single state object (formState) for all form inputs creates a single source of truth for the data.
    // This means that the state of the form is controlled by React, not the DOM.
    const [formState, setFormState] = useState({ username: '', password: '',});
    const [error, setError] = useState(null);
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${baseUrl}/account/login/`, formState);
            const access = response.data.token;
            localStorage.setItem('access_token', access);
            localStorage.setItem('username', formState.username);
            console.log(access);
            setError(null);
            setFormState({ username: '', password: '' });
            fetchUserData(access);
            navigate('/');
        } catch (error) {
            console.error('Login failed', error);
            setError('Invalid username or password');
        }
    };

    const fetchUserData = async (access_token) => {
        try {
            const response = await axios.get(`${baseUrl}/account/user/`, {
                headers: {
                    Authorization: `Token ${access_token}`,
                },
            });
            setUser(response.data.username);
        } catch (error) {
            setUser(null);
            console.error('Error fetching user data', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    useTitle(title);

    return (
        <main>
            <style>{`
                body {
                    background-color: #374151;
                }
            `}
            </style>

            <section>
                <div className="flex flex-col items-center justify-center px-2 py-8 mx-auto h-screen">
                    <a href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 text-white">
                        <img className="w-21 h-20 mr-2" src={Logo} alt="logo" />
                    </a>
                    <div className="w-full bg-white rounded-lg shadow border mt-0 max-w-md xl:p-0 dark:bg-gray-800 border-gray-700">
                        <div className="p-6 space-y-4 space-y-6 p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 text-2xl text-white text-center">
                                Gatekeeper of Secrets
                            </h1>
                            <form onSubmit={handleLogin} className="space-y-4 space-y-6" action="#">
                                <div>
                                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 text-white">Username</label>
                                    <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                                        onChange={handleInputChange}
                                        type="text"
                                        name="username"
                                        id="username"
                                        value={formState.username}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 text-white">Password</label>
                                    <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                                        onChange={handleInputChange}
                                        type="password"
                                        name="password"
                                        id="password"
                                        value={formState.password}
                                        required
                                    />
                                </div>
                                <div className="items-center justify-between p-4">
                                    <Button type="submit">Sign In</Button>
                                </div>
                                <div>
                                    {error && <p className="text-center text-red-500"> {error}</p>}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
};



