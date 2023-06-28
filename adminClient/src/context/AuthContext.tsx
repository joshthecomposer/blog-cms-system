import React from 'react';

interface AuthContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn:React.Dispatch<React.SetStateAction<boolean>>
}
export const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);