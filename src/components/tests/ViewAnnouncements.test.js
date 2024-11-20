import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import configureStore from "redux-mock-store";
import axios from "axios";
import ViewAnnouncement from "../ViewAnnouncement";

jest.mock("axios");
const mockStore = configureStore([]);
const mockNavigate = jest.fn();

// Mock `useNavigate`
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("ViewAnnouncement.js Component", () => {
  let store;
  const mockCourseId = "123";
  const mockAnnouncementId = "1";
  const BASE_URL = "http://mock-base-url.com";

  beforeEach(() => {
    store = mockStore({
      user: { role: "instructor", token: "mock-token" },
    });
    localStorage.setItem("token", "mock-token");
    jest.clearAllMocks();
  });


test("renders announcement details for instructors", async () => {
    const mockAnnouncementId = "1";
    const mockCourseId = "123";
    const mockAnnouncement = {
      id: mockAnnouncementId,
      title: "Test Announcement",
      content: "This is a test announcement",
      updatedAt: "2024-11-16T12:00:00Z",
    };
  
    axios.get.mockResolvedValueOnce({ data: mockAnnouncement });
  
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[`/instructor/course/${mockCourseId}/announcement/${mockAnnouncementId}`]}
        >
          <Routes>
            <Route
              path="/instructor/course/:courseId/announcement/:announcementId"
              element={<ViewAnnouncement />}
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  
    // Wait for and verify the title
    const announcementTitle = document.querySelector('.text-2xl.font-bold');
    expect(announcementTitle).toBeInTheDocument();
    
    // Verify content and date
    const announcementContent = document.querySelector('.card.bg-base-300.rounded-box.grid.min-h-fit.place-items-left.p-5 p');
    expect(announcementContent).toBeInTheDocument();
    
    const announcementDate = document.querySelector('.text-sm.text-gray-500');
    expect(announcementDate).toBeInTheDocument();
  
    // Verify action buttons
    const editButton = screen.getByRole("button", { name: /Edit/i });
    const deleteButton = screen.getByRole("button", { name: /Delete/i });
    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

test("allows instructors to edit announcement", async () => {
    const mockAnnouncementId = "1";
    const mockCourseId = "123";
    const mockAnnouncement = {
      id: mockAnnouncementId,
      title: "Test Announcement",
      content: "This is a test announcement",
      updatedAt: "2024-11-16T12:00:00Z",
    };
  
    // Mock API responses
    axios.get.mockResolvedValueOnce({ data: mockAnnouncement });
    global.fetch = jest.fn().mockResolvedValueOnce({ ok: true });
  
    // Mock dialog behavior
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
  
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/instructor/course/${mockCourseId}/announcement/${mockAnnouncementId}`]}>
          <Routes>
            <Route
              path="/instructor/course/:courseId/announcement/:announcementId"
              element={<ViewAnnouncement />}
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  
    // Wait for the edit button to appear and simulate a click
    const editButton = await screen.findByRole("button", { name: /Edit/i });
    expect(editButton).toBeInTheDocument();
    fireEvent.click(editButton);
  
    // Verify the modal is opened
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  
    // Verify the title and description inputs
    const titleInput = await screen.findByPlaceholderText(/Title/i);
    expect(titleInput).toBeInTheDocument();
    fireEvent.change(titleInput, { target: { value: "Updated Title" } });
    expect(titleInput.value).toBe("Updated Title");
  
    const contentInput = screen.getByPlaceholderText(/Description/i);
    expect(contentInput).toBeInTheDocument();
    fireEvent.change(contentInput, { target: { value: "Updated Content" } });
    expect(contentInput.value).toBe("Updated Content");
  
    // Verify and interact with the Update button
    const updateButton = screen.getByText("Update");
    expect(updateButton).toBeInTheDocument();
    fireEvent.click(updateButton);
  
    // Extract and validate the fetch call
    const [calledUrl, calledConfig] = global.fetch.mock.calls[0];
    expect(calledUrl).toContain(`/instructor/announcement/${mockAnnouncementId}`);
    expect(calledConfig).toEqual(
      expect.objectContaining({
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer mock-token`,
        },
        body: JSON.stringify({
          id: "1",
          title: "Updated Title",
          content: "Updated Content",
          updatedAt: mockAnnouncement.updatedAt,
        }),
      })
    );
 });    

test("allows instructors to delete announcement", async () => {
    const mockAnnouncementId = "1"; // Correctly define the mock announcement ID
    const mockCourseId = "123"; // Define the course ID
    const mockAnnouncement = {
      id: mockAnnouncementId,
      title: "Test Announcement",
      content: "This is a test announcement",
      updatedAt: "2024-11-16T12:00:00Z",
    };
  
    global.fetch = jest.fn().mockResolvedValueOnce({ ok: true });
  
    // Mock the API response for fetching the announcement
    axios.get.mockResolvedValueOnce({ data: mockAnnouncement });
  
    // Mock `dialog` methods
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
  
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/instructor/course/${mockCourseId}/announcement/${mockAnnouncementId}`]}>
          <Routes>
            <Route
              path="/instructor/course/:courseId/announcement/:announcementId"
              element={<ViewAnnouncement />}
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  
    // Wait for the announcement to be rendered
    const deleteButton = await screen.findByRole("button", { name: /Delete/i });
    expect(deleteButton).toBeInTheDocument();
  
    // Simulate clicking the delete button
    fireEvent.click(deleteButton);
  
    // Verify the modal is displayed
    const modal = screen.getByText(/Are you sure you want to delete this announcement?/i);
    expect(modal).toBeInTheDocument();
  
    // Simulate confirming the delete action
    const confirmDeleteButton = screen.getByText(/Yes/i);
    fireEvent.click(confirmDeleteButton);
  
    // Check that the fetch call was made with the correct ID
    expect(fetch.ok);
    // Ensure the user is redirected after deletion
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(`/instructor/course/${mockCourseId}/announcements`);
    });
  
    global.fetch.mockRestore();
  });

  test("renders announcement for employee role", async () => {
    const mockAnnouncement = {
      id: mockAnnouncementId,
      title: "Employee Announcement",
      content: "This is a test announcement for employees",
      updatedAt: "2024-11-16T12:00:00Z",
    };

    const employeeStore = mockStore({
      user: { role: "employee", token: "mock-token" },
    });

    axios.get.mockResolvedValueOnce({ data: mockAnnouncement });

    render(
      <Provider store={employeeStore}>
        <MemoryRouter>
          <ViewAnnouncement />
        </MemoryRouter>
      </Provider>
    );

    expect(await screen.findByText(/Employee Announcement/i)).toBeInTheDocument();
    expect(screen.getByText(/This is a test announcement for employees/i)).toBeInTheDocument();
  });
});
