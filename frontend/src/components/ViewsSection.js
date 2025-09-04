import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Kanban, List, MessageCircle, Eye, ArrowRight } from 'lucide-react';

const ViewsSection = ({ data }) => {
  const viewIcons = {
    0: Kanban,
    1: List, 
    2: MessageCircle
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="bg-primary/10 text-primary mb-4">
              <Eye className="w-4 h-4 mr-2" />
              Múltiplas visões
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {data.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Alterne entre diferentes visualizações para trabalhar do seu jeito
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {data.items.map((view, index) => {
              const IconComponent = viewIcons[index];
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border-0 shadow-lg overflow-hidden">
                  <CardContent className="p-0">
                    {/* Visual representation */}
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-50 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IconComponent className="w-16 h-16 text-gray-400 group-hover:text-accent transition-colors duration-300" />
                      </div>
                      
                      {/* Mock interface elements */}
                      {index === 0 && ( // Kanban
                        <div className="absolute inset-4 grid grid-cols-3 gap-2">
                          {[1,2,3].map(col => (
                            <div key={col} className="bg-white/70 rounded-lg p-2">
                              <div className="h-2 bg-gray-300 rounded mb-1" />
                              {[1,2].map(item => (
                                <div key={item} className="h-6 bg-gray-200 rounded mb-1 opacity-60" />
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {index === 1 && ( // Lista
                        <div className="absolute inset-4">
                          {[1,2,3,4].map(row => (
                            <div key={row} className="flex items-center gap-2 mb-2 bg-white/70 rounded p-2">
                              <div className="w-3 h-3 bg-gray-300 rounded-full" />
                              <div className="flex-1 h-2 bg-gray-300 rounded" />
                              <div className="w-8 h-2 bg-gray-200 rounded" />
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {index === 2 && ( // Inbox
                        <div className="absolute inset-4">
                          {[1,2,3].map(msg => (
                            <div key={msg} className="flex items-center gap-2 mb-2 bg-white/70 rounded p-2">
                              <div className="w-8 h-8 bg-accent/30 rounded-full flex items-center justify-center">
                                <MessageCircle className="w-4 h-4 text-accent" />
                              </div>
                              <div className="flex-1">
                                <div className="h-2 bg-gray-300 rounded mb-1" />
                                <div className="h-2 bg-gray-200 rounded w-3/4" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        {view.name}
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {view.description}
                      </p>
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

export default ViewsSection;