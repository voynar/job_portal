import { Routes, Route } from "react-router-dom";
import { JobHome, JobDetailApp, AdminLogin, AddJobForm, UpdateJob, ApplyToday, PageNotFound, SuccessPage } from "../pages";
import { useState } from "react";

export const AllRoutes = () => {

    const [setUser] = useState(null);

    return (
        <div>
            <Routes>
                <Route path="" element={<JobHome title="Home" setUser={setUser} />} />
                <Route path="job/:id/" element={<JobDetailApp />} />
                <Route path="job/apply/" element={<ApplyToday title="Apply" />} />
                <Route path="job/success/" element={<SuccessPage title="Success!" />} />
                <Route path="admin/" element={<AdminLogin title="Admin" setUser={setUser} />} />
                <Route path="admin/add/" element={<AddJobForm title="Add Job" />} />
                <Route path="admin/update/:id/" element={<UpdateJob title="Update Job" />} />
                <Route path='*' element={<PageNotFound title="Page Not Found" />} />
            </Routes>
        </div>
    )
}


