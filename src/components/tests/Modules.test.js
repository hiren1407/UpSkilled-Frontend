// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import { MemoryRouter, Routes, Route } from "react-router-dom";
// import CourseMaterial from "../Modules"; 
// import * as redux from "react-redux";

// jest.mock("react-redux", () => ({
//     ...jest.requireActual("react-redux"),
//     useSelector: jest.fn(),
//   }));  

// describe("Modules Component Tests", () => {
//   const mockCourseId = "123";
//   const mockModules = [
//     {
//       id: "1",
//       materialTitle: "Module 1",
//       materialDescription: "Description for module 1",
//     },
//     ,
//         {
//             id: "2",
//             materialTitle: "Module 2",
//             materialDescription: "Description for module 2",
//         },
//   ];

//   beforeEach(() => {
//     redux.useSelector.mockImplementation((selector) =>
//       selector({
//         user: { role: "instructor" },
//         courseDetails: { course: { title: "Test Course" } },
//       })
//     );


//     global.fetch = jest.fn().mockImplementation((url, options) => {
//       if (options?.method === "GET" && url.includes("getCourseMaterials")) {
//         return Promise.resolve({
//           ok: true,
//           json: async () => mockModules,
//         });
//       }
//       if (options?.method === "POST" && url.includes("uploadCourseMaterial")) {
//         return Promise.resolve({ ok: true });
//       }
//       if (options?.method === "PUT" && url.includes("updateCourseMaterial")) {
//         return Promise.resolve({ ok: true });
//       }
//       if (options?.method === "DELETE" && url.includes("deleteCourseMaterial")) {
//         return Promise.resolve({ ok: true });
//       }
//       if (options?.method === "GET" && url.includes("getCourseMaterial")) {
//         return Promise.resolve({
//           ok: true,
//           blob: async () => new Blob(["PDF content"], { type: "application/pdf" }),
//         });
//       }
//       return Promise.reject(new Error("Unknown API call"));
//     });
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

// //   test("renders modules and handles loading state", async () => {
// //     render(
// //       <MemoryRouter initialEntries={[`/course/${mockCourseId}/modules`]}>
// //         <Routes>
// //           <Route path="/course/:courseId/modules" element={<CourseMaterial />} />
// //         </Routes>
// //       </MemoryRouter>
// //     );

// //     expect(screen.getByText(/loading/i)).toBeInTheDocument();
// //     const moduleTitle = await screen.findByText("Module 1");
// //     expect(moduleTitle).toBeInTheDocument();
// //     expect(screen.getByText("Module 2")).toBeInTheDocument();
// //   });

// //   test("handles API error gracefully", async () => {
// //     global.fetch.mockRejectedValueOnce(new Error("Failed to fetch"));

// //     render(
// //       <MemoryRouter initialEntries={[`/course/${mockCourseId}/modules`]}>
// //         <Routes>
// //           <Route path="/course/:courseId/modules" element={<CourseMaterial />} />
// //         </Routes>
// //       </MemoryRouter>
// //     );

// //     const errorHeading = await screen.findByText(/Oops! Something went wrong./i);
// //     expect(errorHeading).toBeInTheDocument();

// //     const reloadButton = screen.getByRole("button", { name: /Reload Page/i });
// //     expect(reloadButton).toBeInTheDocument();

// //     fireEvent.click(reloadButton);
// //     expect(global.fetch).toHaveBeenCalled();
// //   });

// //   test("handles module creation", async () => {
// //     render(
// //       <MemoryRouter initialEntries={[`/course/${mockCourseId}/modules`]}>
// //         <Routes>
// //           <Route path="/course/:courseId/modules" element={<CourseMaterial />} />
// //         </Routes>
// //       </MemoryRouter>
// //     );

// //     const createButton = screen.getByText(/Create New/i);
// //     fireEvent.click(createButton);

// //     const modalTitle = screen.getByText(/Create a new module/i);
// //     expect(modalTitle).toBeInTheDocument();

// //     const titleInput = screen.getByPlaceholderText(/Module Title/i);
// //     fireEvent.change(titleInput, { target: { value: "New Module" } });

// //     const descriptionInput = screen.getByPlaceholderText(/Module Description/i);
// //     fireEvent.change(descriptionInput, { target: { value: "Description of new module" } });

// //     const fileInput = screen.getByLabelText(/Upload PDF/i);
// //     const mockFile = new File(["sample"], "module.pdf", { type: "application/pdf" });
// //     fireEvent.change(fileInput, { target: { files: [mockFile] } });

// //     const saveButton = screen.getByText(/Create Module/i);
// //     fireEvent.click(saveButton);

// //     await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
// //       expect.stringContaining("uploadCourseMaterial"),
// //       expect.objectContaining({ method: "POST" })
// //     ));
// //   });

// //   });


// });



import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import CourseMaterial from "../Modules"; 
// Adjust the path accordin

// Mock fetch globally
global.fetch = jest.fn();

// Create a mock Redux store
const mockStore = configureStore([]);

describe("CourseMaterial Component", () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            courseDetails: {
                course: { title: "Test Course" }, // Mocked course details
            },
            user: {
                role: "instructor", // Mocked user role
            },
        });

        HTMLDialogElement.prototype.showModal = jest.fn();
        HTMLDialogElement.prototype.close = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // test("should call delete API and close the modal on confirming delete", async () => {
    //     // Mock fetch for fetching modules
    //     fetch.mockResolvedValueOnce({
    //         ok: true,
    //         json: async () => [
    //             {
    //                 id: "1",
    //                 materialTitle: "Introduction",
    //                 materialDescription: "This module describes what to expect from the ENPM613 Course",
    //             },
    //         ],
    //     });

    //     // Mock fetch for delete API
    //     fetch.mockResolvedValueOnce({
    //         ok: true,
    //         json: async () => ({ message: "Module deleted successfully" }),
    //     });

    //     render(
    //         <Provider store={store}>
    //             <MemoryRouter initialEntries={["/course/123/modules"]}>
    //                 <Routes>
    //                     <Route path="/course/:courseId/modules" element={<CourseMaterial />} />
    //                 </Routes>
    //             </MemoryRouter>
    //         </Provider>
    //     );

    //     // Wait for modules to load
    //     const deleteButtons = await screen.findAllByTestId("deleteButtonTest");
    //     fireEvent.click(deleteButtons[0]);

    //     // Confirm delete
    //     const confirmDeleteButton = await screen.getAllByTestId("deleteModuleTest");
    //     fireEvent.click(confirmDeleteButton[0]);

    //     // Wait for the API to be called and modal to close
    //     // console.log(fetch.mock.calls);
    //     await waitFor(() => {
    //         expect(fetch.ok)
    //     });

    //     const modal = document.getElementById("deleteModule");
    //     expect(modal.open).toBe(false);
    // });

// test("handles module viewing", async () => {
//   const mockCourseId = "123"; // Define mockCourseId
//   const mockModuleId = "1"; // Define mockModuleId
//   const mockModuleData = [
//       {
//           id: mockModuleId,
//           materialTitle: "Introduction",
//           materialDescription: "This module describes what to expect from the ENPM613 Course",
//       },
//   ];

//   const mockBlobContent = "Mock PDF content"; // Dummy Blob content

//   // Mock localStorage.getItem
//   jest.spyOn(window.localStorage.__proto__, "getItem").mockReturnValue("mock-token");

//   // Mock URL.createObjectURL
//   global.URL.createObjectURL = jest.fn(() => "blob:https://upskilled.vercel.app/4627dda7-7211-4e3d-ae82-466dded9206a");

//   // Mock fetch for fetching modules
//   global.fetch
//       .mockResolvedValueOnce({
//           ok: true,
//           json: async () => mockModuleData,
//       })
//       // Mock fetch for viewing a specific module
//       .mockResolvedValueOnce({
//           ok: true,
//           blob: async () => new Blob([mockBlobContent], { type: "application/pdf" }),
//       });

//   render(
//       <Provider store={store}>
//           <MemoryRouter initialEntries={[`/course/${mockCourseId}/modules`]}>
//               <Routes>
//                   <Route path="/course/:courseId/modules" element={<CourseMaterial />} />
//               </Routes>
//           </MemoryRouter>
//       </Provider>
//   );

//   // Wait for the "View Module" button to be present
//   const viewButtons = await screen.findAllByText("View Module", { selector: "button" });
//   expect(viewButtons).toHaveLength(mockModuleData.length);

//   // Simulate clicking the "View Module" button
//   fireEvent.click(viewButtons[0]);

//   // Verify the fetch call for the module PDF
//   await waitFor(() => {
//       expect(global.fetch).toHaveBeenCalledWith(
//           expect.stringContaining(`/instructor/getCourseMaterial/${mockCourseId}/${mockModuleId}`),
//           expect.objectContaining({
//               method: "GET",
//               headers: expect.objectContaining({
//                   "Content-Type": "application/json",
//                   "Authorization": "Bearer mock-token",
//               }),
//           })
//       );
//   });

//   // Verify the URL.createObjectURL was called
//   expect(global.URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));

//   // Verify the modal dialog is displayed
//   const dialog = screen.getByTestId("modulePdfTest");
//   expect(dialog).toBeInTheDocument();
// });

});
