import React from 'react';
import { Card, CardContent } from './ui/card';
import { Bot, MessageSquare, FileText, Send, CheckSquare, BarChart3, MousePointer, Plug } from 'lucide-react';

const iconMap = {
  Bot,
  MessageSquare,
  FileText, 
  Send,
  CheckSquare,
  BarChart3,
  MousePointer,
  Plug
};

const FeaturesSection = ({ whatsappFeatures, productivityFeatures }) => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* WhatsApp Features */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {whatsappFeatures.title}
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto" />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whatsappFeatures.items.map((feature, index) => {
              const IconComponent = iconMap[feature.icon];
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-0 shadow-sm">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                      <IconComponent className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
        
        {/* Productivity Features */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {productivityFeatures.title}
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {productivityFeatures.items.map((feature, index) => {
              const IconComponent = iconMap[feature.icon];
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-0 shadow-sm">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
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

export default FeaturesSection;