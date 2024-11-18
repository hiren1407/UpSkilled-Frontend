import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import configureStore from "redux-mock-store";
import axios from "axios";
import ViewAnnouncement from "../Announcements";

jest.mock("axios");
const mockStore = configureStore([]);
const mockNavigate = jest.fn();

// Mock `useNavigate`
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Announcements.js Component", () => {
  let store;
  const mockCourseId = "123";
  const BASE_URL = "http://mock-base-url.com";

  beforeEach(() => {
    store = mockStore({
      user: { role: "instructor" }, // Mock user as an instructor for tests
    });
    localStorage.setItem("token", "mock-token"); // Set a mock token
    jest.clearAllMocks();
  });

  test('renders "Create New" button for instructors', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/instructor/course/${mockCourseId}/announcements`]}>
          <Routes>
            <Route path="/instructor/course/:courseId/announcements" element={<ViewAnnouncement />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Verify "Create New" button appears for instructors
    const createButton = await screen.findByRole("button", { name: /Create New/i });
    expect(createButton).toBeInTheDocument();

    // Simulate clicking the "Create New" button
    fireEvent.click(createButton);
    expect(mockNavigate).toHaveBeenCalledWith(`/instructor/course/${mockCourseId}/create-announcement`);
  });

  test("renders 'No announcements found' when there are no announcements", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/instructor/course/${mockCourseId}/announcements`]}>
          <Routes>
            <Route path="/instructor/course/:courseId/announcements" element={<ViewAnnouncement />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Verify "No announcements found" is displayed
    const noAnnouncementsMessage = await screen.findByText(/No announcements found/i);
    expect(noAnnouncementsMessage).toBeInTheDocument();
  });

test("renders announcements correctly", async () => {
    const mockAnnouncements = [
      { id: "1", title: "Test Announcement 1", content: "This is a test announcement", updatedAt: "2024-11-16T12:00:00Z" },
      { id: "2", title: "Test Announcement 2", content: "Another test announcement", updatedAt: "2024-11-16T13:00:00Z" },
    ];
  
    axios.get.mockResolvedValueOnce({ data: mockAnnouncements });
  
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/instructor/course/${mockCourseId}/announcements`]}>
          <Routes>
            <Route path="/instructor/course/:courseId/announcements" element={<ViewAnnouncement />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  
    // Verify announcements are displayed
    for (const announcement of mockAnnouncements) {
      const announcementTitle = await screen.findByText(announcement.title);
      const announcementContent = screen.getByText(announcement.content);
      const announcementDate = screen.getByText(new RegExp(new Date(announcement.updatedAt).toLocaleString()));
  
      expect(announcementTitle).toBeInTheDocument();
      expect(announcementContent).toBeInTheDocument();
      expect(announcementDate).toBeInTheDocument();
    }
  
    // Simulate clicking on an announcement
    const announcementCard = screen.getByText(/Test Announcement 1/i).closest("div");
    fireEvent.click(announcementCard);
    expect(mockNavigate).toHaveBeenCalledWith("1");
  });  

  test("handles API errors gracefully", async () => {
    axios.get.mockRejectedValueOnce(new Error("Failed to fetch"));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/instructor/course/${mockCourseId}/announcements`]}>
          <Routes>
            <Route path="/instructor/course/:courseId/announcements" element={<ViewAnnouncement />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Verify "No announcements found" is displayed on API error
    const noAnnouncementsMessage = await screen.findByText(/No announcements found/i);
    expect(noAnnouncementsMessage).toBeInTheDocument();
  });
});
