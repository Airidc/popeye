import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';

describe('App.jsx', () => {
  test('Renders dropdown component', () => {
    render(<App />);
    const dropdownElement = screen.getByText(/Select Route/i);
    expect(dropdownElement).toBeInTheDocument();
  });

  test('Renders map element', () => {
    render(<App />);
    // screen.debug()
    const mapElement = screen.getByLabelText(/zoom in/i);
    expect(mapElement).toBeInTheDocument();
  });

  test('Changes active route', () => {
    render(<App />);

    // Check for default selected route
    const dropdownElement = screen.getByText(/Select Route/i);
    expect(dropdownElement).toBeInTheDocument();

    // select the route and click
    const selectRouteElement = screen.getByText(/Home To Work/i);
    userEvent.click(selectRouteElement);
    // fireEvent.click(selectRouteElement);

    // expect updated text content with selected route
    expect(dropdownElement).toHaveTextContent('Home To Work')
  })

  test('Changes update interval duration', () => {
    render(<App />);

    const intervalbutton = screen.getByRole('button', { name: /5s/i })
    expect(intervalbutton).toBeInTheDocument();
    expect(intervalbutton).not.toHaveClass('active');

    userEvent.click(intervalbutton);
    expect(intervalbutton).toHaveClass('active');
  });
})
