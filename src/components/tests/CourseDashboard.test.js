import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import CourseDashboard from "../CourseDashboard";
import configureStore from "redux-mock-store";

jest.mock("axios");

const mockStore = configureStore([]);
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("CourseDashboard Component", () => {
  let store;
  const mockCourseId = "123";
  const mockCourseDetails = {
    title: "Test Course",
    name: "Introduction to Testing",
    description: "A course about testing React components.",
    instructorName: "John Doe",
  };

  beforeEach(() => {
    store = mockStore({
      user: { role: "instructor" },
    });
    jest.clearAllMocks();
  });
  
  
  test("displays course details for instructor", async () => {
    axios.get.mockResolvedValueOnce({ data: mockCourseDetails });
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/course/${mockCourseId}`]}>
          <Routes>
            <Route path="/course/:courseId" element={<CourseDashboard />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    const courseTitle = await screen.findByText(mockCourseDetails.title);
    expect(courseTitle).toBeInTheDocument();

    const syllabusButton = screen.getByRole("button", { name: /View Syllabus/i });
    fireEvent.click(syllabusButton);
    expect(mockNavigate).toHaveBeenCalledWith("syllabus");

    const materialsButton = screen.getByRole("button", { name: /View Course Material/i });
    fireEvent.click(materialsButton);
    expect(mockNavigate).toHaveBeenCalledWith("modules");
  });

  test("displays Unenroll button and handles unenroll for employees", async () => {
    store = mockStore({
      user: { role: "employee" },
    });
    axios.get.mockResolvedValueOnce({ data: mockCourseDetails });
    global.fetch = jest.fn().mockResolvedValueOnce({ status: 200 });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/course/${mockCourseId}`]}>
          <Routes>
            <Route path="/course/:courseId" element={<CourseDashboard />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    const unenrollButton = await screen.findByRole("button", { name: /Unenroll/i });
    expect(unenrollButton).toBeInTheDocument();
    fireEvent.click(unenrollButton);

    const confirmationModal = await screen.findByText(
      /You will lose all submission and grade related data/i
    );
    expect(confirmationModal).toBeInTheDocument();

    const confirmButton = screen.getByRole("button", { name: /Yes/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/employee");
    });
  });

  test("cancels unenroll action when 'No' is clicked in modal", async () => {
    store = mockStore({
      user: { role: "employee" },
    });
    axios.get.mockResolvedValueOnce({ data: mockCourseDetails });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/course/${mockCourseId}`]}>
          <Routes>
            <Route path="/course/:courseId" element={<CourseDashboard />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    const unenrollButton = await screen.findByRole("button", { name: /Unenroll/i });
    fireEvent.click(unenrollButton);

    const confirmationModal = await screen.findByText(
      /You will lose all submission and grade related data/i
    );
    expect(confirmationModal).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", { name: /No/i });
    fireEvent.click(cancelButton);

    expect(screen.queryByText(/You will lose all submission and grade related data/i)).not.toBeInTheDocument();
  });

  test("updates document title for instructor course", async () => {
    axios.get.mockResolvedValueOnce({ data: mockCourseDetails });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/course/${mockCourseId}`]}>
          <Routes>
            <Route path="/course/:courseId" element={<CourseDashboard />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(document.title).toBe(`${mockCourseDetails.title} - Dashboard`);
    });
  });
});
