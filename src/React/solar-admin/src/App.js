import "./App.css";
import { useState, useEffect } from "react";
import { AllRoutes } from "./Routes/AllRoutes";
import { Header, Footer, ScrollToTop } from "./components";
import UserContext from "./components/UserContext";

function App() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUser(storedUsername); // Set the user context with stored username
        }
    }, []);

    return (
        <div className="App">
            <ScrollToTop />
            <UserContext.Provider value={{ user, setUser }}>
                <Header />
                <AllRoutes />
                <Footer />
            </UserContext.Provider>
        </div>
    );
}

export default App;
