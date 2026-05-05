/**
 * Example Component Test - Button Component
 *
 * Demonstrates React component testing patterns:
 * - Rendering components
 * - User interactions
 * - Prop variations
 * - Accessibility testing
 *
 * Run: npm run test:unit -- Button.test.tsx
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock Button component (replace with actual import)
const Button = ({ 
  children, 
  onClick, 
  disabled, 
  variant = 'primary',
  ...props 
}: any) => (
  <button 
    onClick={onClick} 
    disabled={disabled}
    data-testid="button"
    className={`btn btn-${variant}`}
    {...props}
  >
    {children}
  </button>
);

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByText('Click me');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByText('Click me') as HTMLButtonElement;
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
    expect(button.disabled).toBe(true);
  });

  it('should apply correct variant class', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    let button = screen.getByTestId('button');
    expect(button).toHaveClass('btn-primary');

    rerender(<Button variant="secondary">Secondary</Button>);
    button = screen.getByTestId('button');
    expect(button).toHaveClass('btn-secondary');
  });

  it('should handle multiple clicks', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByText('Click me');
    
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(3);
  });

  it('should have accessible button role', () => {
    render(<Button>Accessible Button</Button>);
    const button = screen.getByRole('button', { name: /accessible button/i });
    expect(button).toBeInTheDocument();
  });

  it('should support custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByTestId('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should render children elements', () => {
    render(
      <Button>
        <span>Icon</span> Text
      </Button>
    );
    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });
});
