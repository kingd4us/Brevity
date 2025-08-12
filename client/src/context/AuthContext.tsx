import React, {createContext, useState, useEffect, useContext,type ReactNode} from "react";

interface User {
    _id: string;
    username: string;
    email: string;
    bio?: string;
  }

  interface AuthContextType {
    user: User | null; // Changed from token
    token: string | null;
    login: (userData: User, token: string) => void; // Update login signature
    logout: () => void;
    isAuthenticated: boolean;
  }

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
      });
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    const login = (userData: User, token: string) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
      };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{user, token, login, logout, isAuthenticated}}>
            {children}
        </AuthContext.Provider>
    );  
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};