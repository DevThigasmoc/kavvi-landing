import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MessageSquare, BarChart3, Users, Zap } from 'lucide-react';

const HeroSection = ({ data }) => {
  const handleTrialClick = () => {
    console.log('Trial clicked');
    // Mock: abrir modal de cadastro
  };

  const handleDemoClick = () => {
    console.log('Demo clicked');
    // Mock: abrir modal de agendamento
  };

  return (
    <section className="hero-section relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50/30" />
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-primary/5 via-accent/10 to-primary/5 rounded-full blur-3xl" />
      
      <div className="relative container mx-auto px-6 py-20 lg:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-accent/10 text-accent hover:bg-accent/20">
                  <Zap className="w-4 h-4 mr-2" />
                  Trial {data.trialDays} dias grátis
                </Badge>
                
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  {data.headline.split('WhatsApp-first').map((part, index) => 
                    index === 0 ? (
                      <span key={index}>{part}</span>
                    ) : (
                      <span key={index}>
                        <span className="text-accent">WhatsApp-first</span>
                        {part}
                      </span>
                    )
                  )}
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  {data.subhead}
                </p>
              </div>
              
              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  onClick={handleTrialClick}
                >
                  {data.ctaPrimary}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 text-lg font-semibold transition-all duration-300"
                  onClick={handleDemoClick}
                >
                  {data.ctaSecondary}
                </Button>
              </div>
              
              {/* Stats preview */}
              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">+32%</div>
                  <div className="text-sm text-gray-500">Taxa de resposta</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">2.5x</div>
                  <div className="text-sm text-gray-500">Mais vendas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">89%</div>
                  <div className="text-sm text-gray-500">Satisfação</div>
                </div>
              </div>
            </div>
            
            {/* Visual mockup */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500">
                {/* Header */}
                <div className="bg-primary text-white p-4 flex items-center gap-3">
                  <MessageSquare className="w-6 h-6" />
                  <span className="font-semibold">Inbox Unificado</span>
                  <Badge className="bg-accent text-primary ml-auto">12 novas</Badge>
                </div>
                
                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Conversation items */}
                  {[
                    { name: "Maria Silva", message: "Interesse no produto Premium", time: "há 2 min", channel: "WhatsApp", status: "hot" },
                    { name: "João Santos", message: "Solicita orçamento urgente", time: "há 5 min", channel: "Instagram", status: "warm" },
                    { name: "Ana Costa", message: "Dúvidas sobre integração", time: "há 10 min", channel: "Facebook", status: "cold" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'hot' ? 'bg-red-500' : 
                        item.status === 'warm' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{item.name}</span>
                          <Badge variant="secondary" className="text-xs">{item.channel}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{item.message}</p>
                      </div>
                      <span className="text-xs text-gray-400">{item.time}</span>
                    </div>
                  ))}
                </div>
                
                {/* Bottom stats */}
                <div className="bg-gray-50 p-4 flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-accent" />
                    <span className="text-gray-600">Conversão: 34%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-accent" />
                    <span className="text-gray-600">5 agentes online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;