import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, AlertCircle, Loader2, Calendar } from 'lucide-react';
import { landingAPI, analyticsAPI } from '../services/api';

const DemoSchedulingModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Info, 2: DateTime, 3: Success
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    company: '',
    preferred_datetime: '',
    timezone: 'America/Sao_Paulo'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [scheduledDemo, setScheduledDemo] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) setError('');
  };

  const validateStep1 = () => {
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
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email inválido');
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    if (!formData.preferred_datetime) {
      setError('Selecione data e horário para o demo');
      return false;
    }
    
    const selectedDate = new Date(formData.preferred_datetime);
    const now = new Date();
    
    if (selectedDate <= now) {
      setError('Selecione uma data futura');
      return false;
    }
    
    // Check business hours (9 AM - 6 PM)
    const hour = selectedDate.getHours();
    if (hour < 9 || hour >= 18) {
      setError('Demos disponíveis das 9h às 18h (horário de Brasília)');
      return false;
    }
    
    // Check weekday
    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      setError('Demos disponíveis apenas em dias úteis');
      return false;
    }
    
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Track demo scheduling attempt
      await analyticsAPI.trackEvent({
        event: 'form_submit',
        properties: {
          action_type: 'demo',
          page: 'whatsapp-lead-generation'
        }
      });
      
      const demoData = {
        ...formData,
        preferred_datetime: new Date(formData.preferred_datetime).toISOString()
      };
      
      const result = await landingAPI.scheduleDemo(demoData);
      
      if (result.success) {
        setScheduledDemo(result.data);
        setStep(3);
        
        // Track successful demo scheduling
        await analyticsAPI.trackEvent({
          event: 'demo_scheduled',
          properties: {
            email: formData.email,
            demo_datetime: formData.preferred_datetime,
            page: 'whatsapp-lead-generation'
          }
        });
      } else {
        setError(result.error || 'Erro ao agendar demo');
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setStep(1);
      setFormData({
        name: '',
        email: '',
        whatsapp: '',
        company: '',
        preferred_datetime: '',
        timezone: 'America/Sao_Paulo'
      });
      setError('');
      setScheduledDemo(null);
      onClose();
    }
  };

  const formatDemoDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Generate available time slots for next 14 days (business hours only)
  const generateTimeSlots = () => {
    const slots = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      // Add time slots (9 AM to 5 PM, every hour)
      for (let hour = 9; hour < 18; hour++) {
        const slotDate = new Date(date);
        slotDate.setHours(hour, 0, 0, 0);
        
        const dateTimeString = slotDate.toISOString().slice(0, 16);
        slots.push({
          value: dateTimeString,
          label: slotDate.toLocaleDateString('pt-BR', {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })
        });
      }
    }
    
    return slots;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === 3 ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                Demo Agendado!
              </>
            ) : (
              <>
                <Calendar className="w-5 h-5 text-primary" />
                Agendar Demo
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        
        {step === 3 ? (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Demo agendado com sucesso!</strong>
                {scheduledDemo && (
                  <div className="mt-2">
                    <strong>Data:</strong> {formatDemoDate(scheduledDemo.demo_scheduled)}
                  </div>
                )}
              </AlertDescription>
            </Alert>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">O que acontece agora:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Você receberá um email de confirmação</li>
                <li>• Nossa equipe entrará em contato 1 dia antes</li>
                <li>• O demo será feito via WhatsApp ou Google Meet</li>
                <li>• Duração: aproximadamente 30 minutos</li>
              </ul>
            </div>
            
            <Button onClick={handleClose} className="w-full">
              Perfeito!
            </Button>
          </div>
        ) : (
          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
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
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Nome da sua empresa"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    Próximo
                  </Button>
                </div>
              </>
            )}
            
            {step === 2 && (
              <>
                <div className="text-sm text-gray-600 mb-4">
                  <strong>{formData.name}</strong>, escolha o melhor horário para seu demo:
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="preferred_datetime">Data e Horário *</Label>
                  <select
                    id="preferred_datetime"
                    name="preferred_datetime"
                    value={formData.preferred_datetime}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Selecione uma data e horário</option>
                    {generateTimeSlots().map((slot, index) => (
                      <option key={index} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500">
                    Horários em Brasília, apenas dias úteis das 9h às 18h
                  </p>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-accent hover:bg-accent/90"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Agendando...
                      </>
                    ) : (
                      'Agendar Demo'
                    )}
                  </Button>
                </div>
              </>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DemoSchedulingModal;