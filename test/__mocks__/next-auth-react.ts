export const signIn = jest.fn();
export const signOut = jest.fn();
export const useSession = () => ({
  data: { user: { id: 'u1', name: 'Tester', email: 't@example.com' } },
  status: 'authenticated',
});
export const SessionProvider = ({ children }: { children: React.ReactNode }) => children as any;
