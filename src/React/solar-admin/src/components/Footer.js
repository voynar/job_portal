import { Link } from "react-router-dom"

export const Footer = () => {
    return (
        <footer className="shadow bg-gray-800">
            <div className="w-full mx-auto max-w-screen-xl p-4 flex flex-grow items-center justify-between">
                <span className="text-sm text-gray-400 text-center">© 2023 <Link to="/" className="hover:underline" />Scarbonze</span>
                <ul className="flex flex-wrap items-center text-sm font-medium text-gray-400">
                    <li>
                        <a href="https://github.com/voynar" target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
                    </li>
                </ul>
            </div>
        </footer>
    )
}


