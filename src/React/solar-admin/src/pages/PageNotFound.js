import { Link } from "react-router-dom";
import { useTitle } from "../hooks";
import { Button } from "../components";
import PageNotFoundImage from "../assets/images/pagenotfound.png";

export const PageNotFound = ({title}) => {

    useTitle(title);

    return (
        <main>
            <section className="flex flex-col justify-center px-2">
                <div className="flex flex-col items-center my-4">
                    <p className="text-6xl text-gray-700 font-bold my-10 dark:text-white">404, Ooops!</p>
                    <div className="max-w-2xl">
                        <img className="rounded" src={PageNotFoundImage} alt="404 Page Not Found" />
                    </div>
                </div>
                <div className="flex justify-center my-4">
                    <Link to="/">
                        <Button>Back to Job Postings</Button>
                    </Link>
                </div>
            </section>
        </main>
    )
}

