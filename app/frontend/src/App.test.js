import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '@src/App';

// Mocking only the Toast component
jest.mock('@components/Toast', () => ({ message, type, onClose }) => (
  <div>Mock Toast</div>
));

describe('App Component', () => {
  it('renders loading state initially', () => {
    render(
      <Router>
        <App />
      </Router>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders home component for student role', async () => {
    render(
      <Router>
        <App />
      </Router>
    );
    expect(screen.getByText('Student Home')).toBeInTheDocument();
  });

  it('renders login component when not authenticated', async () => {
    render(
      <Router>
        <App />
      </Router>
    );
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('renders navbar and header for authenticated user', async () => {
    render(
      <Router>
        <App />
      </Router>
    );
    expect(screen.getByText('Navbar')).toBeInTheDocument();
    expect(screen.getByText('Header')).toBeInTheDocument();
  });
});
