import type {Session} from 'next-auth';
import type {BuiltInProviderType} from 'next-auth/providers';
import type {SignInOptions, SignOutParams} from 'next-auth/react';

let mockSession: Session | null = null;
let mockStatus: 'authenticated' | 'unauthenticated' | 'loading' = 'unauthenticated';

// --- Mock Functions ---
const mockSignIn = jest.fn((provider?: string | BuiltInProviderType, options?: SignInOptions) =>
    Promise.resolve({url: options?.callbackUrl || '/dashboard', ok: true}) // Adjust mock return based on your needs
);
const mockSignOut = jest.fn((options?: SignOutParams) =>
    Promise.resolve({url: options?.callbackUrl || '/', baseUrl: 'http://localhost'}) // Adjust mock return based on your needs
);

// --- Helper for setting mock state in tests ---
export const mockSetSession = (session: Session | null, status: 'authenticated' | 'unauthenticated' | 'loading') => {
    mockSession = session;
    mockStatus = status;
};

// --- Mock useSession Hook ---
export const useSession = jest.fn(() => {
    return {data: mockSession, status: mockStatus};
});

// --- Mock SessionProvider Component ---
export const SessionProvider: React.FC<{ children: React.ReactNode; session?: Session | null }> = ({
                                                                                                       children
                                                                                                   }) => {
    return children;
};

// --- Export Mocked Functions ---
export const signIn: typeof mockSignIn = mockSignIn;
export const signOut: typeof mockSignOut = mockSignOut;

// --- Jest Lifecycle Hooks for Cleaning Mocks ---
beforeEach(() => {
    mockSetSession(null, 'unauthenticated');
    mockSignIn.mockClear();
    mockSignOut.mockClear();
    useSession.mockClear();
});