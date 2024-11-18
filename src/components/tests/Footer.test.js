import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer Component', () => {
    test('renders the footer with the correct copyright text and SVG', () => {
        // Render the Footer component
        render(<Footer />);
    
        // Check if the footer element is present
        const footerElement = screen.getByRole('contentinfo');
        expect(footerElement).toBeInTheDocument();
    
        // Check if the SVG icon exists by querying its `svg` tag
        const svgIcon = footerElement.querySelector('svg');
        expect(svgIcon).toBeInTheDocument();
    
        // Check if the copyright text is correct
        const currentYear = new Date().getFullYear();
        const copyrightText = screen.getByText(`Copyright © ${currentYear} - UpSkilled`);
        expect(copyrightText).toBeInTheDocument();
      });
});
