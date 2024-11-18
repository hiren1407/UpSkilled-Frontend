import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import ManageInstructors from "../Admin/ManageInstructors";
import { BASE_URL } from "../../utils/constants";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const mockStore = configureStore([]);


jest.mock("axios");

describe("ManageInstructors Component", () => {
  let store;
    const mockInstructors = [
        {
          id: 1,
          firstName: "Saanya",
          lastName: "Dhir",
          email: "saanyadhir@gmail.com",
          status: "ACTIVE",
        },
        {
          id: 2,
          firstName: "Test",
          lastName: "Name",
          email: "test@gmail.com",
          status: "INACTIVE",
        },
      ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Object.defineProperty(window, "localStorage", {
    //     value: {
    //       getItem: jest.fn(() => "mocked-token"), // Mock the token value
    //     },
    //     writable: true,
    //   });

    store = mockStore({
      user: { token: "mock-token" },
  });
  localStorage.setItem("token", "mock-token");
  });

//     global.localStorage = {
//       getItem: jest.fn().mockReturnValue("mocked-token"),
//     };
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   test("renders the heading", () => {
//     render(<ManageInstructors />);
//     expect(screen.getByTestId("heading")).toBeInTheDocument();
//     expect(screen.getByTestId("heading")).toHaveTextContent("Manage Instructors");
//   });


test("fetches and displays instructors", async () => {
    // Mock the API response
    //axios.get.mockResolvedValueOnce({ data: mockInstructors });

    // Mock the API response
  axios.get.mockResolvedValueOnce({
    data: [
      { id: 1, firstName: "Saanya", lastName: "Dhir", email: "saanyadhir@gmail.com", status: "ACTIVE" },
      { id: 2, firstName: "Test", lastName: "Name", email: "test@gmail.com", status: "INACTIVE" },
    ],
  });

    render(
      <Provider store={store}>
          <MemoryRouter initialEntries={[`/admin/manage-instructors`]}>
              <Routes>
                  <Route
                      path="/admin/manage-instructors"
                      element={<ManageInstructors />}
                  />
              </Routes>
          </MemoryRouter>
      </Provider>
  );
  
    // Wait for the API call to be made
    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    // Verify the API endpoint
    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/admin/listInstructors`, {
      headers: { Authorization: "Bearer mock-token" },
      withCredentials: true,
    });

    // Verify active instructors are displayed
    await waitFor(() => {
      expect(screen.getByTestId("activeInstructorName-1")).toHaveTextContent("Saanya Dhir");
      expect(screen.getByTestId("activeInstructorEmail-1")).toHaveTextContent("saanyadhir@gmail.com");
    });

    // Verify inactive instructors are displayed
    expect(screen.getByTestId("inactiveInstructorName-2")).toHaveTextContent("Test Name");
    expect(screen.getByTestId("inactiveInstructorEmail-2")).toHaveTextContent("test@gmail.com");
  });

//   test("approves an inactive instructor", async () => {
//     axios.get.mockResolvedValueOnce({ data: mockInstructors });
//     global.fetch.mockResolvedValueOnce({ status: 200 });

//     render(<ManageInstructors />);

//     // Wait for the instructors to load
//     await waitFor(() => {
//       expect(screen.getByTestId("inactiveInstructorName-2")).toBeInTheDocument();
//     });

//     // Approve the instructor
//     fireEvent.click(screen.getByTestId("approveButton-2"));

//     await waitFor(() => {
//       expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/admin/approve/2`, expect.anything());
//     });
//   });

//   test("denies an inactive instructor", async () => {
//     axios.get.mockResolvedValueOnce({ data: mockInstructors });
//     global.fetch.mockResolvedValueOnce({ status: 200 });

//     render(<ManageInstructors />);

//     // Wait for the instructors to load
//     await waitFor(() => {
//       expect(screen.getByTestId("inactiveInstructorName-2")).toBeInTheDocument();
//     });

//     // Deny the instructor
//     fireEvent.click(screen.getByTestId("denyButton-2"));

//     await waitFor(() => {
//       expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/admin/reject/2`, expect.anything());
//     });
//   });

//   test("handles API errors gracefully", async () => {
//     axios.get.mockRejectedValueOnce(new Error("Failed to fetch instructors"));

//     render(<ManageInstructors />);

//     await waitFor(() => {
//       expect(screen.queryByTestId("activeInstructorName-1")).not.toBeInTheDocument();
//       expect(screen.queryByTestId("inactiveInstructorName-2")).not.toBeInTheDocument();
//     });
//   });

//   test("renders and switches between tabs", async () => {
//     axios.get.mockResolvedValueOnce({ data: mockInstructors });

//     render(<ManageInstructors />);

//     // Wait for the instructors to load
//     await waitFor(() => {
//       expect(screen.getByTestId("activeInstructorsTable")).toBeInTheDocument();
//       expect(screen.getByTestId("inactiveInstructorsTable")).toBeInTheDocument();
//     });

//     // Switch to inactive instructors tab
//     fireEvent.click(screen.getByTestId("inactiveInstructorsTab"));

//     // Verify inactive instructors tab content
//     await waitFor(() => {
//       expect(screen.getByTestId("inactiveInstructorName-2")).toBeInTheDocument();
//     });

//     // Switch back to active instructors tab
//     fireEvent.click(screen.getByTestId("activeInstructorsTab"));

//     // Verify active instructors tab content
//     await waitFor(() => {
//       expect(screen.getByTestId("activeInstructorName-1")).toBeInTheDocument();
//     });
//   });

//   test("handles state updates correctly after approving an instructor", async () => {
//     axios.get.mockResolvedValueOnce({ data: mockInstructors });
//     global.fetch.mockResolvedValueOnce({ status: 200 });

//     render(<ManageInstructors />);

//     // Approve the instructor
//     await waitFor(() => {
//       fireEvent.click(screen.getByTestId("approveButton-2"));
//     });

//     await waitFor(() => {
//       expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/admin/approve/2`, expect.anything());
//     });

//     // Simulate flag update and re-fetch
//     axios.get.mockResolvedValueOnce({
//       data: [{ id: 2, firstName: "Jane", lastName: "Smith", email: "jane.smith@example.com", status: "ACTIVE" }],
//     });

//     // Wait for state updates
//     await waitFor(() => {
//       expect(screen.getByTestId("activeInstructorName-2")).toHaveTextContent("Jane Smith");
//     });
//   });
});
