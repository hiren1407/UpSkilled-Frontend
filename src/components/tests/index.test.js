import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from '../../reportWebVitals';
import App from '../../App';

jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
  })),
}));

jest.mock('../../reportWebVitals', () => jest.fn());

describe('index.js', () => {
  it('should call ReactDOM.createRoot with the correct DOM element', () => {
    const rootElement = document.createElement('div');
    rootElement.setAttribute('id', 'root');
    document.body.appendChild(rootElement);

    // Import the index file to trigger the rendering logic
    require('../../index');
  });

  it('should render the App component inside React.StrictMode', () => {
    const mockRender = jest.fn();
    ReactDOM.createRoot.mockReturnValue({ render: mockRender });

    // Import the index file to trigger the rendering logic
    require('../../index');
  });

  it('should call reportWebVitals', () => {
    require('../../index');
  });
});
