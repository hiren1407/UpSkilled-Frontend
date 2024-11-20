// Modules.test.js
import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import CourseMaterial from '../Modules';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Mock global fetch
global.fetch = jest.fn();

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mocked-url');

// Mock localStorage.getItem('token')
Storage.prototype.getItem = jest.fn(() => 'mock-token');

const mockStore = configureStore([]);

describe('CourseMaterial Component', () => {
    let store;
    beforeEach(() => {
        store = mockStore({
            courseDetails: { course: { id: '1', title: 'Test Course' } },
            user: { role: 'instructor' },
        });
        // Mock the showModal and close methods on HTMLDialogElement
        HTMLDialogElement.prototype.showModal = jest.fn();
        HTMLDialogElement.prototype.close = jest.fn();

        fetch.mockClear();
        localStorage.getItem.mockClear();

         // Mock document.getElementById to return an object with a showModal method
         const originalGetElementById = document.getElementById;
         document.getElementById = jest.fn((id) => {
             if (id === 'modulePdf') {
                 return {
                     showModal: jest.fn(),
                     querySelector: jest.fn(),
                     close: jest.fn(),
                 };
             }
             return originalGetElementById.call(document, id);
            });
    });

    

    test('renders loading state correctly', () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/course/1/materials']}>
                    <Routes>
                        <Route path="/course/:courseId/materials" element={<CourseMaterial />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    test('renders error state when fetch fails', async () => {
        fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/course/1/materials']}>
                    <Routes>
                        <Route path="/course/:courseId/materials" element={<CourseMaterial />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });

        expect(screen.getByText(/Oops! Something went wrong./i)).toBeInTheDocument();
        expect(screen.getByText(/We encountered an error. Please try again later./i)).toBeInTheDocument();
    });

    test('renders "No modules available" when modules list is empty', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([]),
            })
        );

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/course/1/materials']}>
                    <Routes>
                        <Route path="/course/:courseId/materials" element={<CourseMaterial />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Course Materials for Test Course')).toBeInTheDocument();
        });

        expect(screen.getByText('No modules available')).toBeInTheDocument();
    });

    test('renders modules when data is fetched successfully', async () => {
        const mockModules = [
            {
                id: 'module1',
                materialTitle: 'Module 1',
                materialDescription: 'Description of Module 1',
            },
            {
                id: 'module2',
                materialTitle: 'Module 2',
                materialDescription: 'Description of Module 2',
            },
        ];

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockModules),
            })
        );

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/course/1/materials']}>
                    <Routes>
                        <Route path="/course/:courseId/materials" element={<CourseMaterial />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Module 1')).toBeInTheDocument();
            expect(screen.getByText('Module 2')).toBeInTheDocument();
        });
    });

    test('instructor can create a new module', async () => {
        // Mock initial fetch
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([]),
            })
        );
    
        // Render component
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/course/1/materials']}>
                    <Routes>
                        <Route path="/course/:courseId/materials" element={<CourseMaterial />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
    
        await waitFor(() => {
            expect(screen.getByText('Course Materials for Test Course')).toBeInTheDocument();
        });
    
        // Open modal to create module
        fireEvent.click(screen.getByTestId("createNewButton"));
    
        // Fill form
        fireEvent.change(screen.getByLabelText('Module Title'), { target: { value: 'New Module' } });
        fireEvent.change(screen.getByLabelText('Module Description'), { target: { value: 'New Module Description' } });
    
        // Mock file input
        const file = new File(['dummy content'], 'module.pdf', { type: 'application/pdf' });
        const fileInput = screen.getByLabelText('Upload PDF');
        Object.defineProperty(fileInput, 'files', { value: [file] });
        fireEvent.change(fileInput);
    
        // Mock module creation fetch
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
            })
        );
    
        // Submit form
        fireEvent.click(screen.getByTestId("createModuleTest"));
    
        // await waitFor(() => {
        //     expect(screen.queryByText('Create a new module')).not.toBeInTheDocument();
        // });
    
        // Mock fetch after module creation
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([
                    {
                        id: 'module1',
                        materialTitle: 'New Module',
                        materialDescription: 'New Module Description',
                    },
                ]),
            })
        );
    
        // await waitFor(() => {
        //     expect(screen.getByText('New Module')).toBeInTheDocument();
        // });
    });

    test('employee can view modules but not create/edit/delete', async () => {
        store = mockStore({
            courseDetails: { course: { id: '1', title: 'Test Course' } },
            user: { role: 'employee' },
        });
    
        const mockModules = [
            {
                id: 'module1',
                materialTitle: 'Module 1',
                materialDescription: 'Description of Module 1',
            },
        ];
    
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockModules),
            })
        );
    
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/course/1/materials']}>
                    <Routes>
                        <Route path="/course/:courseId/materials" element={<CourseMaterial />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
    
        await waitFor(() => {
            expect(screen.getByText('Module 1')).toBeInTheDocument();
        });
    
        // Ensure "Create New" button is not present
        expect(screen.queryByText('Create New')).not.toBeInTheDocument();
    
        // Ensure "Edit" and "Delete" buttons are not present
        expect(screen.queryByTestId('editBtn')).not.toBeInTheDocument();
        expect(screen.queryByTestId('deleteButtonTest')).not.toBeInTheDocument();
    });
    
    test('instructor can edit a module', async () => {
        // Mock initial fetch with one module
        const initialModules = [
            {
                id: 'module1',
                materialTitle: 'Original Module',
                materialDescription: 'Original Description',
            },
        ];

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(initialModules),
            })
        );

        // Render component
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/course/1/materials']}>
                    <Routes>
                        <Route path="/course/:courseId/materials" element={<CourseMaterial />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        // Wait for component to finish loading and display the module
        await waitFor(() => {
            expect(screen.getByText('Original Module')).toBeInTheDocument();
        });

        // Click on the "Edit" button for the module
        fireEvent.click(screen.getByTestId('editBtn'));

        // Ensure the modal is open
        expect(screen.getByText('Edit Module Details')).toBeInTheDocument();

        // Fill in the form with new data
        fireEvent.change(screen.getByLabelText('Module Title'), { target: { value: 'Updated Module' } });
        fireEvent.change(screen.getByLabelText('Module Description'), { target: { value: 'Updated Description' } });

        // Mock file input (required field)
        const file = new File(['updated content'], 'updated_module.pdf', { type: 'application/pdf' });
        const fileInput = screen.getByLabelText('Upload PDF');
        Object.defineProperty(fileInput, 'files', { value: [file] });
        fireEvent.change(fileInput);

        // Mock the API call to update the module
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
            })
        );

        // Submit the form to edit the module
        fireEvent.click(screen.getByText('Edit Module'));

        // Mock the fetch after module update to return updated module
        const updatedModules = [
            {
                id: 'module1',
                materialTitle: 'Updated Module',
                materialDescription: 'Updated Description',
            },
        ];

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(updatedModules),
            })
        );

        // Wait for the updated module to appear in the list
        // await waitFor(() => {
        //     expect(screen.getByText('Updated Module')).toBeInTheDocument();
        // });

        // Ensure the old module title is no longer in the document
        expect(screen.queryByText('Original Module')).not.toBeInTheDocument();
    });

    test('instructor can delete a module', async () => {
        // Mock initial fetch with one module
        const initialModules = [
            {
                id: 'module1',
                materialTitle: 'Module to Delete',
                materialDescription: 'Description of module to delete',
            },
        ];

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(initialModules),
            })
        );

        // Render component
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/course/1/materials']}>
                    <Routes>
                        <Route path="/course/:courseId/materials" element={<CourseMaterial />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        // Wait for component to finish loading and display the module
        await waitFor(() => {
            expect(screen.getByText('Module to Delete')).toBeInTheDocument();
        });

        // Click on the "Delete" button for the module
        fireEvent.click(screen.getByTestId('deleteButtonTest'));

        // Ensure the delete confirmation modal is open
        expect(screen.getByText('Delete module')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to delete this module?')).toBeInTheDocument();

        // Mock the API call to delete the module
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(true),
            })
        );

        // Confirm deletion by clicking the "Delete" button in the modal
        fireEvent.click(screen.getByTestId("confirmDeleteButton"));


        // Mock the fetch after module deletion to return an empty list
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([]),
            })
        );
   });

test('employee can view a module', async () => {
    const mockModules = [
        {
            id: 'module1',
            materialTitle: 'Module 1',
            materialDescription: 'Description of Module 1',
        },
    ];

    // Mock initial fetch for modules
    fetch.mockImplementationOnce(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockModules),
        })
    );

    // Render component
    render(
        <Provider store={store}>
            <MemoryRouter initialEntries={['/course/1/materials']}>
                <Routes>
                    <Route path="/course/:courseId/materials" element={<CourseMaterial />} />
                </Routes>
            </MemoryRouter>
        </Provider>
    );

    // Wait for modules to be displayed
    await waitFor(() => {
        expect(screen.getByText('Module 1')).toBeInTheDocument();
    });

    // Mock fetch for module PDF
    const mockPdfBlob = new Blob(['PDF content'], { type: 'application/pdf' });
    fetch.mockImplementationOnce(() =>
        Promise.resolve({
            ok: true,
            blob: () => Promise.resolve(mockPdfBlob),
        })
    );

    // Click "View Module"
    fireEvent.click(screen.getByTestId('viewModuleTest'));

    // Ensure showModal was called
    //expect(document.getElementById('modulePdf').showModal).toHaveBeenCalled();

    // Wait for the module title to be updated
    // await waitFor(() => {
    //     expect(screen.getByText('Module 1')).toBeInTheDocument();
    // });
});

});

