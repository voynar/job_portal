import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components";
import UserContext from "../components/UserContext";
import { useTitle } from "../hooks";
import { baseUrl } from "../services/job.service";
import crewLead from "../assets/images/metal-heads.jpg";
import fieldTech from "../assets/images/cole-slaw.JPG";
import installer from "../assets/images/installer.JPG";
import scheduler from "../assets/images/crisis-schedule.jpg";
import hrSpecialist from "../assets/images/ask-hr.jpg";
import warehouseMgr from "../assets/images/warehouse-mgr.jpg";

export const JobDetailApp = () => {

    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const params = useParams();
    const [job, setJob] = useState({});
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [randomPhoto, setRandomPhoto] = useState(null);
    const access_token = localStorage.getItem('access_token');

    const fetchRandomPhoto = async () => {
        try {
            const response = await axios.get("https://api.unsplash.com/photos/random", {
                headers: {
                    Authorization: "Client-ID oxs7m1PNMHkUmZ-EprjigPDmoh68xADlZz0P2lE-HBM",
                },
                params: {
                    query: "solar panels",
                },
            });
            const { urls } = response.data;
            setRandomPhoto(urls.regular);
        } catch (error) {
            console.error("Error fetching random photo: ", error);
        }
    };

    useEffect(() => {
        fetchRandomPhoto();
    }, []);

    useEffect(() => {
        async function fetchJob() {
            const response = await fetch(`${baseUrl}/positions/${params.id}/`);
            const json = await response.json();
            setJob(json);
        }
        fetchJob();
    }, [params.id]);

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.delete(`${baseUrl}/positions/${params.id}/`,
                {
                    headers: {
                        Authorization: `Token ${access_token}`,
                    },
                }
            );

            console.log('DELETE request sent:', response);
            if (response.status === 204) {
                console.log('Job deleted successfully');
                setSuccess("Job deleted successfully");
                setError(null);
                navigate("/");
            } else {
                console.error('DELETE request did not return a success status');
                setError('Error deleting job.');
            }
        } catch (error) {
            console.error('Error deleting job: ', error);
            setError('Error deleting job.');
        }
    };

    const imageMap = {
        1: fieldTech,
        2: installer,
        3: scheduler,
        4: crewLead,
        5: hrSpecialist,
        6: warehouseMgr,
    };

    const jobImage = imageMap[job.id] || randomPhoto;

    useTitle(job.title);

    return (
        <main>
            <section className="flex justify-around flex-wrap py-5">
                <div className="max-w-sm">
                    <img className="rounded mt-7" src={jobImage} alt="SES" />
                </div>
                <div className="max-w-2xl text-black text-lg">
                    <h1 className="text-4xl font-bold my-3 mx-4 mt-5 text-center lg:text-left">{job.title}</h1>
                    <p className="my-4 mx-4">{job.description}</p><br />
                    <p className="text-sm mx-4 my-4">
                        <span className="mr-2 font-bold">Requirements: </span>
                        <span>{job.requisites}</span>
                    </p>
                    <p className="text-sm mx-4 my-4">
                        <span className="mr-2 font-bold">Salary: </span>
                        <span>${job.salary}</span>
                    </p>
                    <p className="text-sm mx-4 my-4">
                        <span className="mr-2 font-bold">Available: </span>
                        <span>{job.availability}</span>
                    </p>
                    <div className="flex justify-center my-4 mt-12">
                        <Link to="/job/apply">
                            {!user && <Button>Apply!</Button>}
                        </Link>
                    </div>
                    <div className="flex justify-center">

                        <span className="mr-4">
                            {user &&
                                <Link to={`/admin/update/${job.id}`}>
                                    <Button>Update</Button>
                                </Link>
                            }
                        </span>
                        <span className="ml-4">
                            {user &&
                                <Link to="/">
                                    <button onClick={handleDelete} className="font-medium px-5 py-2.5 rounded-lg text-xl bg-gradient-to-r from-red-500 from-10% via-orange-500 via-30% to-pink-500 text-center text-black">Delete</button>
                                </Link>
                            }
                        </span>
                    </div>
                    {/* <div className="flex justify-center mt-4">
                        
                    </div> */}
                    <div className="p-4">
                        {success && <p className="text-sm text-center text-green-500">{success}</p>}
                        {error && <p className="text-sm text-center text-red-500"> {error}</p>}
                    </div>
                </div>
            </section>
        </main>
    )
}
