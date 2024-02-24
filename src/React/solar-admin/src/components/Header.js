import { useState, useContext, useEffect, useCallback, useMemo } from "react";
import UserContext from "./UserContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../services/job.service";
import Logo from "../assets/logo.png";

export const Header = () => {

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [hidden, setHidden] = useState(true);
    const [customMsg, setCustomMsg] = useState("");
    const { user, setUser } = useContext(UserContext);
    const smThreshold = 460;

    const handleLogout = useCallback(async () => {
        try {
            const logoutToken = localStorage.getItem('access_token');
            await axios.post(`${baseUrl}/account/logout/`, null, {
                headers: {
                    Authorization: `Token ${logoutToken}`,
                },
            });
            setUser(null); // Clear the user state on logout
            localStorage.removeItem('access_token');
            localStorage.removeItem('username');
        } catch (error) {
            console.error('Logout failed', error);
        }
    }, [setUser]);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (user) {
            const sessionTimeout = setTimeout(() => {
                handleLogout();
                showLogoutMessage();
            }, 800000)

            return () => clearTimeout(sessionTimeout);
        }
    }, [user, handleLogout]);

    const showLogoutMessage = () => {
        window.alert('You have been automatically logged out');
    };

    const handleBoogs = () => {
        setHidden(true); // Close the menu when the logo is clicked
    };

    const customMessages = useMemo(() => {
        return {
            Hillevi: "❤︎ Sup, Baby!? ❤︎",
            Zayn: "WhatUP, BigDog!?",
            Tonya: "Welcome, BossLady!",
        };
    }, []);

    // eslint-disable-next-line
    useEffect(() => {
        if (user && customMessages[user]) {
            setCustomMsg(customMessages[user]);
        } else {
            setCustomMsg("");
        }
    }, [user, customMessages]);

    return (
        <header className="sticky top-0">
            <nav className="bg-gray-900">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">

                    <Link to="/" onClick={handleBoogs} className="flex items-center">
                        <img src={Logo} className="h-9 mr-3" alt="SES Logo" />
                        <span className="self-center text-xl font-semibold whitespace-nowrap text-white">SES Job Postings</span>
                    </Link>

                    <div className="block text-white flex justify-between items-center">

                        {windowWidth < smThreshold ? (
                            <p></p>
                        ) : (
                            user ? (
                                <p className="mr-4">{customMsg || `Hello, ${user}!`}</p>
                            ) : (
                                <p className="mr-4">Welcome, Guest!</p>
                            )
                        )}

                        <button onClick={() => setHidden(!hidden)} data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-400 hover:bg-gray-700 focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                            </svg>
                        </button>

                    </div>

                    <div className={`${hidden ? "hidden" : ""} w-full md:block md:w-auto md:flex justify-end items-center p-2`} id="navbar-default">

                        {windowWidth < smThreshold ? (
                            user ? (
                                <p className="text-white text-md text-center">{customMsg || `Hello, ${user}!`}</p>
                            ) : (
                                <p className="text-white text-md text-center">Welcome, Guest!</p>
                            )
                        ) : (
                            <p></p>
                        )}

                        <ul className="font-medium flex flex-col mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 bg-gray-800 md:bg-gray-900 border-gray-700">

                            <li>
                                <Link to="admin/" onClick={handleBoogs} className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 text-white md:hover:text-blue-500 hover:bg-gray-700 hover:text-white md:hover:bg-transparent">Admin</Link>
                            </li>

                            <li>
                                {user && (
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            handleBoogs();
                                        }}
                                        className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 text-white md:hover:text-blue-500 hover:bg-gray-700 hover:text-white md:hover:bg-transparent text-white"
                                    >
                                        Logout
                                    </button>
                                )}
                            </li>

                            {user && <li>
                                <Link to="admin/add/" onClick={handleBoogs} className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 text-white md:hover:text-blue-500 hover:bg-gray-700 hover:text-white md:hover:bg-transparent">Add Job</Link>
                            </li>}

                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
}

