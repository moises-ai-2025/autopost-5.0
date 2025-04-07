import axios from 'axios';

const API_BASE_URL = 'https://n8n-blue.up.railway.app/webhook/app/api';
const LOGIN_ENDPOINT = 'https://n8n-blue.up.railway.app/webhook/f9b7f193-3849-45c9-81a4-b10bd0bf3625';

// Create axios instance with debugging interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true, // Important for receiving and sending cookies
  timeout: 15000 // Increase timeout to 15 seconds
});

// Add request interceptor for debugging
api.interceptors.request.use(
  config => {
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('API Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  error => {
    console.error('API Response Error:', error.response || error);
    return Promise.reject(error);
  }
);

export interface CreateUserData {
  nome: string;
  email: string;
  senha: string;
  empresa: string;
  segmentos: string;
  sub_segmentos?: string;
  voice: string;
  descricao: string;
  cor_primaria: string;
  target: string;
}

export interface LoginData {
  email: string;
  senha: string;
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: {
    msg: string;
    code?: string;
  };
  status: number;
}

export const createUser = async (userData: CreateUserData): Promise<ApiResponse> => {
  try {
    console.log('Creating user with data:', userData);
    const response = await api.post('/create/user', userData);
    console.log('Create user response:', response);
    
    return {
      success: true,
      data: response.data,
      status: response.status
    };
  } catch (error: any) {
    console.error('Create user error:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log('Error response data:', error.response.data);
      console.log('Error response status:', error.response.status);
      
      return {
        success: false,
        error: {
          msg: error.response.data.msg || 'Erro ao criar usuário',
          code: error.response.data.code
        },
        status: error.response.status
      };
    } else if (error.request) {
      // The request was made but no response was received
      console.log('No response received:', error.request);
      
      return {
        success: false,
        error: { msg: 'Sem resposta do servidor. Verifique sua conexão.' },
        status: 0
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error message:', error.message);
      
      return {
        success: false,
        error: { msg: error.message || 'Erro ao processar a requisição' },
        status: 0
      };
    }
  }
};

export const loginUser = async (loginData: LoginData): Promise<ApiResponse> => {
  try {
    console.log('Logging in with data:', loginData);
    
    // Try with fetch API to the new login endpoint
    try {
      const fetchResponse = await fetch(LOGIN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(loginData),
        credentials: 'include'
      });
      
      console.log('Fetch login response status:', fetchResponse.status);
      
      if (fetchResponse.ok) {
        const data = await fetchResponse.json();
        console.log('Fetch login response data:', data);
        
        return {
          success: true,
          data: data,
          status: fetchResponse.status
        };
      }
      
      // If fetch fails with a response, handle it
      if (fetchResponse.status) {
        let errorData;
        try {
          errorData = await fetchResponse.json();
        } catch (e) {
          errorData = { msg: 'Erro ao processar resposta do servidor' };
        }
        
        return {
          success: false,
          error: {
            msg: errorData.msg || 'Email ou senha inválidos',
            code: errorData.code
          },
          status: fetchResponse.status
        };
      }
    } catch (fetchError) {
      console.error('Fetch login error:', fetchError);
      // Continue to axios as fallback
    }
    
    // Fallback to axios if fetch fails
    const response = await axios.post(LOGIN_ENDPOINT, loginData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: true,
      timeout: 15000
    });
    
    console.log('Axios login response:', response);
    
    return {
      success: true,
      data: response.data,
      status: response.status
    };
  } catch (error: any) {
    console.error('Login error:', error);
    
    if (error.response) {
      console.log('Error response data:', error.response.data);
      console.log('Error response status:', error.response.status);
      
      return {
        success: false,
        error: {
          msg: error.response.data.msg || 'Email ou senha inválidos',
          code: error.response.data.code
        },
        status: error.response.status
      };
    } else if (error.request) {
      console.log('No response received:', error.request);
      
      return {
        success: false,
        error: { msg: 'Sem resposta do servidor. Verifique sua conexão.' },
        status: 0
      };
    } else {
      console.log('Error message:', error.message);
      
      return {
        success: false,
        error: { msg: error.message || 'Erro ao processar a requisição' },
        status: 0
      };
    }
  }
};

// Check if user is authenticated by verifying the cookie
export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    // This endpoint would verify the authToken cookie and return user info
    // For now, we'll just check if the cookie exists in the browser
    const cookies = document.cookie.split(';');
    return cookies.some(cookie => cookie.trim().startsWith('authToken='));
  } catch (error) {
    console.error('Error checking auth status:', error);
    return false;
  }
};

export default api;
