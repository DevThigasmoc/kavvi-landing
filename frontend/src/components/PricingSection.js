import React from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Check, Star, Zap } from 'lucide-react';

const PricingSection = ({ data }) => {
  const handleTrialClick = (planName) => {
    console.log(`Trial clicked for ${planName}`);
    // Mock: abrir modal de cadastro
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="bg-primary/10 text-primary mb-4">
              <Zap className="w-4 h-4 mr-2" />
              {data.note}
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {data.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {data.subtitle}
            </p>
          </div>
          
          {/* Pricing cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {data.plans.map((plan, index) => (
              <Card 
                key={index}
                className={`relative group transition-all duration-500 border-0 shadow-lg hover:shadow-2xl ${
                  plan.highlighted 
                    ? 'hover:-translate-y-4 ring-2 ring-accent ring-opacity-50' 
                    : 'hover:-translate-y-2'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-accent text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600">
                      {plan.description}
                    </p>
                  </div>
                  
                  <div className="py-6">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {plan.price}
                    </div>
                    {plan.price === 'Consulte' && (
                      <p className="text-sm text-gray-500">
                        Preços personalizados
                      </p>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-accent/10 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-accent" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* CTA */}
                  <Button 
                    className={`w-full py-6 text-lg font-semibold transition-all duration-300 ${
                      plan.highlighted
                        ? 'bg-accent hover:bg-accent/90 text-white hover:scale-105'
                        : 'bg-primary hover:bg-primary/90 text-white hover:scale-105'
                    }`}
                    onClick={() => handleTrialClick(plan.name)}
                  >
                    Teste grátis
                  </Button>
                  
                  {plan.highlighted && (
                    <p className="text-center text-sm text-gray-500">
                      Sem compromisso • Cancele quando quiser
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Bottom note */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Todos os planos incluem suporte em português e integração com WhatsApp Business
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <span>✓ Sem taxa de setup</span>
              <span>✓ Migração gratuita</span>
              <span>✓ Treinamento incluído</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;