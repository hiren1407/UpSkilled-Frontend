import { BrowserRouter, Routes, Route } from "react-router-dom"
import Body from "./components/Body"
import Login from "./components/Login"
import { Provider } from "react-redux"
import appStore from "./utils/appStore"
import AdminDashboard from "./components/Admin/AdminDashboard"
import EmployeeDashboard from "./components/Employee/EmployeeDashboard"
import InstructorDashboard from "./components/Instructor/InstructorDashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import ViewAnnouncement from "./components/ViewAnnouncement"
import ManageInstructors from "./components/Admin/ManageInstructors"
import ManageCourses from "./components/Admin/ManageCourses"
import Profile from "./components/Profile"
import SideBar from "./components/SideBar"


function App() {


    return (
        <>
            <Provider store={appStore}>
                <BrowserRouter basename="/">
                    <Routes>
                        <Route path="/" element={<Body />}>
                            <Route path="/" element={<Login />} />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute allowedRoles={['admin', 'instructor', 'employee']}>
                                        <div className="flex">
                                            <SideBar />
                                            <div className="flex-grow">
                                                <Profile />
                                            </div>
                                        </div>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/manage-instructors"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <div className="flex">
                                            <SideBar />
                                            <div className="flex-grow">
                                                <ManageInstructors />
                                            </div>
                                        </div>


                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/manage-courses"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <div className="flex">
                                            <SideBar />
                                            <div className="flex-grow">
                                                <ManageCourses />
                                            </div>
                                        </div>
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/employee"
                                element={
                                    <ProtectedRoute allowedRoles={['employee']}>
                                        <EmployeeDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/instructor"
                                element={
                                    <ProtectedRoute allowedRoles={['instructor']}>
                                        <InstructorDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/employee/:id/announcements" element={<ViewAnnouncement />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </Provider>

        </>
    )
}

export default App
