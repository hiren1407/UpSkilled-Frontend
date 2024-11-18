import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import configureStore from "redux-mock-store";
import Assignments from "../Assignments";

const mockStore = configureStore([]);

describe("Assignments Component", () => {
    let store;
    const mockCourseId = "123";

    beforeEach(() => {
        store = mockStore({
            user: { role: "instructor", token: "mock-token" },
        });
        localStorage.setItem("token", "mock-token");
    });

    afterEach(() => {
        localStorage.clear();
    });

    test("renders assignments heading", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Assignments />
                </MemoryRouter>
            </Provider>
        );

        const heading = screen.getByRole("heading", { name: /Assignments/i });
        expect(heading).toBeInTheDocument();
    });

    test("displays 'No assignments found' when no assignments are available", async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/instructor/course/${mockCourseId}/assignments`]}>
                    <Routes>
                        <Route path="/instructor/course/:courseId/assignments" element={<Assignments />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        const noAssignmentsMessage = await screen.findByText(/No assignments found/i);
        expect(noAssignmentsMessage).toBeInTheDocument();
    });

    test("renders 'Create New' button for instructors", async () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/instructor/course/${mockCourseId}/assignments`]}>
                    <Routes>
                        <Route path="/instructor/course/:courseId/assignments" element={<Assignments />} />
                        <Route path="/instructor/course/:courseId/create-assignment" element={<div>Mock Create Assignment Page</div>} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
    
        const createButton = screen.getByRole("button", { name: /Create New/i });
        expect(createButton).toBeInTheDocument();
    
        // Simulate clicking on the 'Create New' button
        fireEvent.click(createButton);
    
        // Verify navigation to the create-assignment page
        const mockCreateAssignmentPage = await screen.findByText(/Mock Create Assignment Page/i);
        expect(mockCreateAssignmentPage).toBeInTheDocument();
    });
    

    test("handles API errors gracefully", async () => {
        global.fetch = jest.fn().mockRejectedValueOnce(new Error("Failed to fetch assignments"));

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/instructor/course/${mockCourseId}/assignments`]}>
                    <Routes>
                        <Route path="/instructor/course/:courseId/assignments" element={<Assignments />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        // Ensure the "No assignments found" message is displayed
        const noAssignmentsMessage = await screen.findByText(/No assignments found/i);
        expect(noAssignmentsMessage).toBeInTheDocument();
    });

    test("renders assignments list when assignments are available", async () => {
        const mockAssignments = [
            {
                assignmentDetails: {
                    id: "1",
                    title: "Assignment 1",
                    description: "First assignment description",
                    "deadline": 1731775680000
                },
                submissionDetails: [
                    {
                        gradeBook: { grade: 85 },
                    },
                ],
            },
            {
                assignmentDetails: {
                    id: "2",
                    title: "Assignment 2",
                    description: "Second assignment description",
                    "deadline": 1731775680000
                },
                submissionDetails: [],
            },
        ];
    
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockAssignments,
        });
    
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/instructor/course/${mockCourseId}/assignments`]}>
                    <Routes>
                        <Route
                            path="/instructor/course/:courseId/assignments"
                            element={<Assignments />}
                        />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
    
        for (const assignment of mockAssignments) {
            const title = await screen.findByText(assignment.assignmentDetails.title);
            expect(title).toBeInTheDocument();
    
            const description = screen.getByText(assignment.assignmentDetails.description);
            expect(description).toBeInTheDocument();
        }
    });
});
