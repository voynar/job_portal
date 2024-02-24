import { Link } from "react-router-dom"
import { Button } from "../components"
import { useTitle } from "../hooks"

export const SuccessPage = ({title}) => {

    useTitle(title);

    return (
        <main>
            <div>
                <div className="p-4 mb-4 text-sm text-center text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                    <span className="font-medium">Application Submitted Successfully!</span><br />
                    <span className="font-medium">Thank you for applying</span>
                </div>
                <div className="flex justify-center">
                    <span className="mr-4">
                        <Link to="/">
                            <Button>Apply again</Button>
                        </Link>
                    </span>
                </div>
            </div>
        </main>
    )
}