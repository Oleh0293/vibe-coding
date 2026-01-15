import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { server, mockTasks } from './mocks';

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Clean up after all tests
afterAll(() => server.close());

describe('App', () => {
  it('renders the app and shows loading state', () => {
    render(<App />);
    
    expect(screen.getByText('Task Manager')).toBeInTheDocument();
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('displays tasks after loading', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
  });

  it('shows stats with correct counts', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    const stats = screen.getByTestId('stats');
    expect(stats).toHaveTextContent('2 total');
    expect(stats).toHaveTextContent('1 open');
    expect(stats).toHaveTextContent('1 done');
  });

  it('filters tasks by status', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    // Click on Open filter
    fireEvent.click(screen.getByTestId('filter-open'));
    
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Task 2')).not.toBeInTheDocument();
    });

    // Click on Done filter
    fireEvent.click(screen.getByTestId('filter-done'));
    
    await waitFor(() => {
      expect(screen.queryByText('Test Task 1')).not.toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });
  });

  it('adds a new task', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    const input = screen.getByTestId('task-input');
    const addButton = screen.getByTestId('add-task-btn');

    await user.type(input, 'New Test Task');
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('New Test Task')).toBeInTheDocument();
    });
  });
});
