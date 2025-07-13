import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {LoginForm} from './login-form';
import {mockSetSession, signIn} from '../../__mocks__/next-auth/react';
import {useRouter, useSearchParams} from 'next/navigation';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(() => ({
        push: jest.fn(),
    })),
    useSearchParams: jest.fn(() => ({
        get: jest.fn(),
    })),
}));

describe('LoginForm', () => {
    const mockPush = jest.fn();
    const mockGetSearchParams = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({push: mockPush});
        (useSearchParams as jest.Mock).mockReturnValue({get: mockGetSearchParams});
        mockPush.mockClear();
        mockGetSearchParams.mockClear();
    });

    test('renders login form elements for unauthenticated users', () => {
        mockSetSession(null, 'unauthenticated');
        mockGetSearchParams.mockReturnValue('null');

        render(<LoginForm/>);

        expect(screen.getByRole('heading', {name: /Welcome to BizLenz./i})).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/lorem@ipsum.com/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /Login/i})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /Continue with Discord/i})).toBeInTheDocument();
        expect(screen.getByText(/Don't have an account?/i)).toBeInTheDocument();
        expect(screen.getByText(/Terms of Service/i)).toBeInTheDocument();

        expect(mockPush).not.toHaveBeenCalled();
    });

    test('calls signIn with correct arguments when Discord button is clicked', () => {
        mockSetSession(null, 'unauthenticated');
        mockGetSearchParams.mockReturnValue('/dashboard');

        render(<LoginForm/>);
        const discordButton = screen.getByRole('button', {name: /Continue with Discord/i});
        fireEvent.click(discordButton);

        expect(signIn).toHaveBeenCalledTimes(1);
        expect(signIn).toHaveBeenCalledWith('discord', {callbackUrl: '/dashboard'});

        expect(mockPush).not.toHaveBeenCalled();
    });

    test('redirects authenticated users to dashboard', async () => {
        mockSetSession({
            user: {
                id: 'user123',
                name: 'Test User',
                email: 'test@example.com',
                image: null,
            },
            expires: '2024-12-31T23:59:59.000Z',
        }, 'authenticated');

        mockGetSearchParams.mockImplementation((key: string) => {
            if (key === 'callbackUrl') return '/';
            return null;
        });

        render(<LoginForm/>);

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledTimes(1);
            expect(mockPush).toHaveBeenCalledWith('/');
        });
    });

    test('redirects authenticated users to default dashboard if no callbackUrl in search params', async () => {
        mockSetSession({
            user: {
                id: 'user123',
                name: 'Test User',
                email: 'test@example.com',
                image: null,
            },
            expires: '2024-12-31T23:59:59.000Z',
        }, 'authenticated');

        mockGetSearchParams.mockImplementation((key: string) => {
            if (key === 'callbackUrl') return null; // No callbackUrl
            return null;
        });

        render(<LoginForm/>);

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledTimes(1);
            expect(mockPush).toHaveBeenCalledWith('/dashboard');
        });
    });
});