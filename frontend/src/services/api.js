import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// UTM Parameter capture
export const captureUTMParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams = {};
  
  const utmKeys = [
    'utm_source', 'utm_medium', 'utm_campaign', 
    'utm_term', 'utm_content', 'gclid', 'gbraid',
    'wbraid', 'fbclid', 'msclkid', 'device',
    'placement', 'dkinsertion'
  ];
  
  utmKeys.forEach(key => {
    const value = urlParams.get(key);
    if (value) {
      utmParams[key] = value;
    }
  });
  
  // Add referrer
  if (document.referrer) {
    utmParams.referrer = document.referrer;
  }
  
  return utmParams;
};

// Store UTM params globally
export const globalUTM = captureUTMParams();

// API Services
export const landingAPI = {
  // Submit form (trial or demo interest)
  submitForm: async (formData) => {
    try {
      const payload = {
        ...formData,
        utm: globalUTM
      };
      
      const response = await api.post('/landings/submit', payload);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Form submission error:', error);
      
      let errorMessage = 'Erro interno. Tente novamente.';
      
      if (error.response?.status === 429) {
        errorMessage = error.response.data.detail || 'Muitas tentativas. Tente novamente mais tarde.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data.detail || 'Dados inválidos. Verifique os campos.';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Schedule demo
  scheduleDemo: async (demoData) => {
    try {
      const payload = {
        ...demoData,
        utm: globalUTM
      };
      
      const response = await api.post('/landings/demo/schedule', payload);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Demo scheduling error:', error);
      
      let errorMessage = 'Erro ao agendar demo. Tente novamente.';
      
      if (error.response?.status === 400) {
        errorMessage = error.response.data.detail || 'Data/hora inválida.';
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/landings/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'unhealthy' };
    }
  }
};

export const analyticsAPI = {
  // Track page view
  trackPageView: async (properties = {}) => {
    try {
      await api.post('/analytics/page_view', {
        ...properties,
        ...globalUTM
      });
    } catch (error) {
      console.warn('Analytics page view failed:', error);
    }
  },

  // Track CTA clicks
  trackCTAClick: async (ctaData) => {
    try {
      await api.post('/analytics/cta_click', {
        ...ctaData,
        utm: globalUTM
      });
    } catch (error) {
      console.warn('Analytics CTA click failed:', error);
    }
  },

  // Track generic events
  trackEvent: async (eventData) => {
    try {
      await api.post('/analytics/track', {
        ...eventData,
        properties: {
          ...eventData.properties,
          ...globalUTM
        }
      });
    } catch (error) {
      console.warn('Analytics event failed:', error);
    }
  }
};

// Error messages in Portuguese
export const errorMessages = {
  'required_field': 'Este campo é obrigatório',
  'invalid_email': 'Por favor, insira um email válido',
  'invalid_whatsapp': 'Por favor, insira um WhatsApp válido (ex: 11999999999)',
  'rate_limit': 'Muitas tentativas. Tente novamente em alguns minutos',
  'server_error': 'Erro interno. Tente novamente em alguns instantes',
  'network_error': 'Erro de conexão. Verifique sua internet',
  'demo_conflict': 'Horário não disponível. Escolha outro horário',
  'trial_exists': 'Você já possui um trial ativo'
};

export default api;