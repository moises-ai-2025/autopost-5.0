import React, { createContext, useContext, useState, useEffect } from 'react';
import { createUser, CreateUserData, loginUser, LoginData, checkAuthStatus } from '../services/api';
import { toast } from 'react-toastify';

interface BusinessInfo {
  industry: string;
  description: string;
  website?: string;
  subIndustry?: string;
}

interface BrandData {
  brandColors: string[];
  brandVoice: string;
  targetAudience: string;
  logo?: string | null;
}

interface ScheduleDay {
  day: string;
  times: string[];
  platforms: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  businessName?: string;
  setupComplete: boolean;
  brandData?: BrandData;
  businessInfo?: BusinessInfo;
  postSchedule?: ScheduleDay[];
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  updateUser: (userData: Partial<User>) => void;
  saveUserToDatabase: () => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First check if we have a valid auth cookie
        const hasAuthCookie = await checkAuthStatus();
        
        if (hasAuthCookie) {
          // If we have a valid cookie, we're authenticated
          // In a real app, we would fetch user data from the server here
          setIsAuthenticated(true);
          
          // Check for saved user in localStorage as fallback
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
          }
        } else {
          // No valid cookie, check localStorage as fallback
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function with API integration and improved error handling
  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      const loginData: LoginData = {
        email,
        senha: password
      };
      
      // Use the new login endpoint directly with fetch
      const response = await fetch('https://n8n-blue.up.railway.app/webhook/f9b7f193-3849-45c9-81a4-b10bd0bf3625', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(loginData),
        credentials: 'include'
      });
      
      console.log('Direct fetch login response status:', response.status);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('Direct fetch login response data:', responseData);
        
        // Create user object
        const userData: User = {
          id: Date.now().toString(), // We'll use a temporary ID
          name: email.split('@')[0], // Temporary name based on email
          email,
          setupComplete: true // Assume setup is complete for existing users
        };
        
        setCurrentUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, message: 'Login realizado com sucesso!' };
      } else {
        // Login failed
        let errorMessage = 'Falha ao fazer login. Por favor, tente novamente.';
        
        if (response.status === 401) {
          errorMessage = 'Email ou senha inválidos.';
        } else if (response.status === 0) {
          errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
        }
        
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Ocorreu um erro inesperado. Por favor, tente novamente.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function with improved error handling
  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      // Create local user first
      const userData: User = {
        id: Date.now().toString(),
        name,
        email,
        password,
        setupComplete: false
      };
      
      setCurrentUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true, message: 'Conta criada com sucesso! Complete seu perfil para continuar.' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Ocorreu um erro ao criar sua conta. Por favor, tente novamente.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    
    // Clear the auth cookie
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, this would trigger a password reset email
      return { success: true, message: 'Instruções de recuperação de senha foram enviadas para seu email.' };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, message: 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.' };
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Function to save user data to the database via API with improved error handling
  const saveUserToDatabase = async (): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) {
      console.error('No current user found');
      return { success: false, message: 'Nenhum usuário logado.' };
    }
    
    try {
      setIsLoading(true);
      
      // Get the latest user data from localStorage to ensure we have the most recent updates
      const savedUserData = localStorage.getItem('user');
      const latestUserData = savedUserData ? JSON.parse(savedUserData) : currentUser;
      
      console.log('Latest user data from localStorage:', latestUserData);
      
      // Prepare data for API
      const apiData: CreateUserData = {
        nome: latestUserData.name,
        email: latestUserData.email,
        senha: latestUserData.password || '',
        empresa: latestUserData.businessName || '',
        segmentos: latestUserData.businessInfo?.industry || '',
        sub_segmentos: latestUserData.businessInfo?.subIndustry || '',
        voice: latestUserData.brandData?.brandVoice || '',
        descricao: latestUserData.businessInfo?.description || '',
        cor_primaria: latestUserData.brandData?.brandColors?.[0] || '#4F46E5',
        target: latestUserData.brandData?.targetAudience || ''
      };
      
      console.log('Sending user data to API:', apiData);
      
      const result = await createUser(apiData);
      console.log('API response:', result);
      
      if (result.success) {
        // User created successfully
        return { 
          success: true, 
          message: 'Usuário registrado com sucesso! Você será redirecionado para o dashboard.' 
        };
      } else {
        if (result.status === 409) {
          // User already exists - this is actually okay for our flow
          // We'll treat it as a success since the user can now login
          return { 
            success: true, 
            message: result.error?.msg || 'Este e-mail já está cadastrado. Você será redirecionado para o dashboard.' 
          };
        } else {
          // Other error
          return { 
            success: false, 
            message: result.error?.msg || 'Falha ao registrar usuário no banco de dados.' 
          };
        }
      }
    } catch (error) {
      console.error('Error saving user to database:', error);
      return { success: false, message: 'Erro ao salvar dados no servidor.' };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    resetPassword,
    updateUser,
    saveUserToDatabase
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
