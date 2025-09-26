/**
 * @jest-environment jsdom
 */

import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/Button';

describe('Button Component', () => {
  test('renders button with correct text', () => {
    render(<Button onClick={() => console.log('Click me')}>Click me</Button>);
    const buttonElement = screen.getByText(/click me/i);
    expect(buttonElement).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const buttonElement = screen.getByText(/click me/i);
    fireEvent.click(buttonElement);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('is disabled when disabled prop is true', () => {
    render(<Button onClick={() => console.log('Click me')} disabled={true}>Click me</Button>);
    const buttonElement = screen.getByText(/click me/i);
    expect(buttonElement).toBeDisabled();
  });
});