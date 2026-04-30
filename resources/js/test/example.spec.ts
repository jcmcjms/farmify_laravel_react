import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Welcome from '../pages/welcome';

describe('Welcome', () => {
    it('renders welcome message', () => {
        render(<Welcome />);
        expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    });
});