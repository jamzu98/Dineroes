import { createContext, Dispatch, SetStateAction } from 'react';

interface AuthContextType {
  isDemoUser: boolean;
  setIsDemoUser: Dispatch<SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
