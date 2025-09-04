import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowRight, Zap, Clock, Shield } from 'lucide-react';

const FinalCtaSection = ({ data }) => {
  const handleTrialClick = () => {
    console.log('Final CTA: Trial clicked');
    // Mock: abrir modal de cadastro
  };

  const handleDemoClick = () => {
    console.log('Final CTA: Demo clicked');
    // Mock: abrir modal de agendamento
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary to-primary/90 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/10" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      
      <div className="relative container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Começe hoje mesmo
          </Badge>
          
          {/* Main content */}
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight">
            {data.headline}
          </h2>
          <p className="text-xl lg:text-2xl text-white/90 mb-12 leading-relaxed">
            {data.subhead}
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Button 
              size="lg"
              className="bg-accent hover:bg-accent/90 text-primary px-10 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              onClick={handleTrialClick}
            >
              {data.ctaPrimary}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-white/30 text-white hover:bg-white hover:text-primary px-10 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105"
              onClick={handleDemoClick}
            >
              {data.ctaSecondary}
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-white/80">
              <Clock className="w-5 h-5 text-accent" />
              <span>Ativação em 5 minutos</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-white/80">
              <Shield className="w-5 h-5 text-accent" />
              <span>Dados 100% seguros</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-white/80">
              <Zap className="w-5 h-5 text-accent" />
              <span>Suporte especializado</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCtaSection;