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
import CourseDashboard from "./components/CourseDashboard"
import Announcements from "./components/Announcements"
import CreateAnnouncement from "./components/Instructor/CreateAnnouncement"
import Syllabus from "./components/Syllabus"
import ManageInstructors from "./components/Admin/ManageInstructors"
import ManageCourses from "./components/Admin/ManageCourses"
import Profile from "./components/Profile"
import SideBar from "./components/SideBar"
import Assignments from "./components/Assignments"
import CreateAssignment from "./components/Instructor/CreateAssignment"
import ViewAssignment from "./components/Instructor/ViewAssignmentforInstructor"
import ViewIndividualAssignmentSubmission from "./components/Instructor/ViewIndividualAssignmentSubmission"
import Modules from "./components/Modules"
import ViewAllCourses from "./components/Employee/ViewAllCourses"
import CourseDetails from "./components/Employee/CourseDetails"
import AssignmentView from "./components/Employee/AssignmentView"
import Error from "./components/Error"
import ViewGrades from "./components/Employee/ViewGrades"

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
                                path="/employee/all-courses"
                                element={
                                    <ProtectedRoute allowedRoles={['employee']}>
                                        <ViewAllCourses />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/employee/course-details/:courseId"
                                element={
                                    <ProtectedRoute allowedRoles={['employee']}>
                                        <CourseDetails />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/employee/course/:courseId"
                                element={
                                    <ProtectedRoute allowedRoles={['employee']}>
                                        <div className="flex"><SideBar />
                                            <div className="flex-grow">
                                                <CourseDashboard />
                                            </div>
                                        </div>
                                    </ProtectedRoute>} />
                            <Route path="/employee/course/:courseId/announcements"
                                element={
                                    <ProtectedRoute allowedRoles={['employee']}>
                                        <div className="flex"><SideBar />
                                            <div className="flex-grow">
                                                <Announcements />
                                            </div>
                                        </div>
                                    </ProtectedRoute>} />
                            <Route path="/employee/course/:courseId/announcements/:announcementId"
                                element={<ProtectedRoute allowedRoles={['employee']}>
                                    <div className="flex"><SideBar />
                                        <div className="flex-grow">
                                            <ViewAnnouncement />
                                        </div>
                                    </div>
                                </ProtectedRoute>} />
                            <Route path="/employee/course/:courseId/syllabus"
                                element={<ProtectedRoute allowedRoles={['employee']}>
                                    <div className="flex"><SideBar />
                                        <div className="flex-grow">
                                            <Syllabus />
                                        </div>
                                    </div>
                                </ProtectedRoute>} />
                            <Route
                                path="/employee/course/:courseId/assignments"
                                element={<ProtectedRoute allowedRoles={['employee']}>
                                    <div className="flex"><SideBar />
                                        <div className="flex-grow"><Assignments />
                                        </div>
                                    </div>
                                </ProtectedRoute>} />
                            <Route path="/employee/course/:courseId/assignments/:assignmentId"
                                element={<ProtectedRoute allowedRoles={['employee']}>
                                    <div className="flex"><SideBar />
                                        <div className="flex-grow">
                                            <AssignmentView />
                                        </div>
                                    </div>
                                    </ProtectedRoute>} />
                            <Route path="/employee/course/:courseId/grades" 
                            element={<ProtectedRoute allowedRoles={['employee']}>
                                <div className="flex"><SideBar /> 
                                <div className="flex-grow">
                                    <ViewGrades />
                                    </div>
                                    </div>
                                    </ProtectedRoute>} />


                            <Route
                                path="/instructor"
                                element={
                                    <ProtectedRoute allowedRoles={['instructor']}>
                                        <InstructorDashboard />
                                    </ProtectedRoute>
                                }
                            />


                            <Route path="/employee/:id/announcements" element={<ProtectedRoute allowedRoles={['employee']}><div className="flex"><SideBar /> <div className="flex-grow"><ViewAnnouncement /></div></div></ProtectedRoute>} />
                            <Route path="/instructor/course/:courseId" element={<ProtectedRoute allowedRoles={['instructor']}><div className="flex"><SideBar /> <div className="flex-grow"><CourseDashboard /></div></div></ProtectedRoute>} />
                            <Route path="/instructor/course/:courseId/announcements" element={<ProtectedRoute allowedRoles={['instructor']}><div className="flex"><SideBar /> <div className="flex-grow"><Announcements /></div></div></ProtectedRoute>} />
                            <Route path="/instructor/course/:courseId/create-announcement" element={<ProtectedRoute allowedRoles={['instructor']}><div className="flex"><SideBar /> <div className="flex-grow"><CreateAnnouncement /></div></div></ProtectedRoute>} />
                            <Route path="/instructor/course/:courseId/announcements/:announcementId" element={<ProtectedRoute allowedRoles={['instructor']}><div className="flex"><SideBar /> <div className="flex-grow"><ViewAnnouncement /></div></div></ProtectedRoute>} />
                            <Route path="/instructor/course/:courseId/syllabus" element={<ProtectedRoute allowedRoles={['instructor']}><div className="flex"><SideBar /> <div className="flex-grow"><Syllabus /></div></div></ProtectedRoute>} />
                            <Route path="/instructor/course/:courseId/assignments" element={<ProtectedRoute allowedRoles={['instructor']}><div className="flex"><SideBar /> <div className="flex-grow"><Assignments /></div></div></ProtectedRoute>} />
                            <Route path="/instructor/course/:courseId/create-assignment" element={<ProtectedRoute allowedRoles={['instructor']}><div className="flex"><SideBar /> <div className="flex-grow"><CreateAssignment /></div></div></ProtectedRoute>} />
                            <Route path="/instructor/course/:courseId/assignments/:assignmentId" element={<ProtectedRoute allowedRoles={['instructor']}><div className="flex"><SideBar /> <div className="flex-grow"><ViewAssignment /></div></div></ProtectedRoute>} />
                            <Route path="/instructor/course/:courseId/assignments/:assignmentId/submission/:submissionId" element={<ProtectedRoute allowedRoles={['instructor']}><div className="flex"><SideBar /> <div className="flex-grow"><ViewIndividualAssignmentSubmission /></div></div></ProtectedRoute>} />
                            <Route path="/instructor/course/:courseId/modules" element={<ProtectedRoute allowedRoles={['instructor']}><div className="flex"><SideBar /> <div className="flex-grow"><Modules /></div></div></ProtectedRoute>} />
                            <Route path="/employee/course/:courseId/modules" element={<ProtectedRoute allowedRoles={['employee']}><div className="flex"><SideBar /> <div className="flex-grow"><Modules /></div></div></ProtectedRoute>} />
                            <Route path="*" element={<ProtectedRoute allowedRoles={['admin', 'employee', 'instructor']}><Error /></ProtectedRoute>} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </Provider>

        </>
    )
}

export default App
