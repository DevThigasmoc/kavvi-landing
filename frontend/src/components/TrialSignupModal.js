import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { landingAPI, analyticsAPI } from '../services/api';

const TrialSignupModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    company: '',
    notes: '',
    action_type: 'trial'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [trialExpires, setTrialExpires] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Nome é obrigatório');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Email é obrigatório');
      return false;
    }
    
    if (!formData.whatsapp.trim()) {
      setError('WhatsApp é obrigatório');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email inválido');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Track form submission attempt
      await analyticsAPI.trackEvent({
        event: 'form_submit',
        properties: {
          action_type: 'trial',
          page: 'whatsapp-lead-generation'
        }
      });
      
      const result = await landingAPI.submitForm(formData);
      
      if (result.success) {
        setSuccess(true);
        setTrialExpires(result.data.trial_expires);
        
        // Track successful trial start
        await analyticsAPI.trackEvent({
          event: 'trial_started',
          properties: {
            email: formData.email,
            page: 'whatsapp-lead-generation'
          }
        });
      } else {
        setError(result.error || 'Erro ao processar solicitação');
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        name: '',
        email: '',
        whatsapp: '',
        company: '',
        notes: '',
        action_type: 'trial'
      });
      setSuccess(false);
      setError('');
      setTrialExpires(null);
      onClose();
    }
  };

  const formatTrialExpiry = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {success ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                Trial Ativado!
              </>
            ) : (
              'Iniciar Trial Gratuito'
            )}
          </DialogTitle>
        </DialogHeader>
        
        {success ? (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Parabéns!</strong> Seu trial de 3 dias foi ativado com sucesso.
                {trialExpires && (
                  <div className="mt-2 text-sm">
                    <strong>Válido até:</strong> {formatTrialExpiry(trialExpires)}
                  </div>
                )}
              </AlertDescription>
            </Alert>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Próximos passos:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Você receberá um email com instruções de acesso</li>
                <li>• Configure sua conta em até 5 minutos</li>
                <li>• Conecte seu WhatsApp Business</li>
                <li>• Comece a capturar leads imediatamente</li>
              </ul>
            </div>
            
            <Button onClick={handleClose} className="w-full">
              Entendi
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome completo"
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp *</Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="11999999999"
                disabled={isLoading}
                required
              />
              <p className="text-xs text-gray-500">
                Digite apenas números (ex: 11999999999)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Nome da sua empresa"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Como podemos ajudar?</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Conte-nos sobre suas necessidades..."
                disabled={isLoading}
                rows={3}
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Iniciar Trial'
                )}
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 text-center">
              Ao continuar, você concorda com nossos{' '}
              <a href="/termos" className="text-primary hover:underline">
                Termos de Uso
              </a>{' '}
              e{' '}
              <a href="/privacidade" className="text-primary hover:underline">
                Política de Privacidade
              </a>
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TrialSignupModal;