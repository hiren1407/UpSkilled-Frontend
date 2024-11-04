import { BrowserRouter, Routes, Route } from "react-router-dom"
import Body from "./components/Body"
import Login from "./components/Login"
import { Provider } from "react-redux"
import appStore from "./utils/appStore"
import AdminDashboard from "./components/AdminDashboard"
import EmployeeDashboard from "./components/EmployeeDashboard"
import InstructorDashboard from "./components/InstructorDashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import ViewAnnouncement from "./components/ViewAnnouncement"

function App() {


    return (
        <>
            <Provider store={appStore}>
                <BrowserRouter basename="/">
                    <Routes>
                        <Route path="/" element={<Body />}>
                            <Route path="/" element={<Login />} />
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <AdminDashboard />
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
