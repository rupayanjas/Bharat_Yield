import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  farmSize: string;
  cropTypes: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('bharatYieldUser');
    const storedAuth = localStorage.getItem('bharatYieldAuth');
    
    if (storedUser && storedAuth === 'true') {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Get all registered users from localStorage
      const users = JSON.parse(localStorage.getItem('bharatYieldUsers') || '[]');
      
      // Find user with matching email and password
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (foundUser) {
        // Remove password from user object before storing
        const { password: _, ...userWithoutPassword } = foundUser;
        
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        
        // Store user data and auth status
        localStorage.setItem('bharatYieldUser', JSON.stringify(userWithoutPassword));
        localStorage.setItem('bharatYieldAuth', 'true');
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    try {
      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem('bharatYieldUsers') || '[]');
      
      // Check if user already exists
      const userExists = existingUsers.some((u: any) => u.email === userData.email);
      if (userExists) {
        return false;
      }
      
      // Create new user with unique ID
      const newUser = {
        ...userData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
      };
      
      // Add to users array
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('bharatYieldUsers', JSON.stringify(updatedUsers));
      
      // Auto-login after registration
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      
      localStorage.setItem('bharatYieldUser', JSON.stringify(userWithoutPassword));
      localStorage.setItem('bharatYieldAuth', 'true');
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('bharatYieldUser');
    localStorage.removeItem('bharatYieldAuth');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
