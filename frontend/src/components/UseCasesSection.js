import React from 'react';
import { Card, CardContent } from './ui/card';
import { TrendingUp, Users, Target, ArrowRight } from 'lucide-react';

const iconMap = {
  TrendingUp,
  Users,
  Target
};

const UseCasesSection = ({ data }) => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {data.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Soluções completas para cada necessidade da sua equipe
            </p>
            <div className="w-24 h-1 bg-primary mx-auto mt-4" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {data.cases.map((useCase, index) => {
              const IconComponent = iconMap[useCase.icon];
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg overflow-hidden cursor-pointer"
                >
                  <CardContent className="p-8 text-center relative">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent/5 to-primary/5 rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-500" />
                    
                    {/* Icon */}
                    <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-10 h-10 text-primary group-hover:text-accent transition-colors" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4 group-hover:text-primary transition-colors">
                      {useCase.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {useCase.description}
                    </p>
                    
                    {/* Action indicator */}
                    <div className="flex items-center justify-center gap-2 text-accent group-hover:gap-4 transition-all">
                      <span className="font-medium">Saiba mais</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;