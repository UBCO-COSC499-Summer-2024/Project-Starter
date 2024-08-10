// app/frontend/tests/components/Authenticated.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Authenticated from '../../src/components/Authenticated';

describe('Authenticated Component', () => {
  test('renders the authenticated message', () => {
    render(<Authenticated />);

    // Check if the heading is rendered
    expect(screen.getByText('Congrats! You are authenticated!')).toBeInTheDocument();

    // Check if the link is rendered
    expect(screen.getByText('Click me to go to the home page')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/');
  });
});
