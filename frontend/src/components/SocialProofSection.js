import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Quote, Star, TrendingUp } from 'lucide-react';

const SocialProofSection = ({ data }) => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {data.title}
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto" />
          </div>
          
          {/* Metrics */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {data.metrics.map((metric, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">
                    {metric.value}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {metric.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Testimonials */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {data.testimonials.map((testimonial, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-500 border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent/10 rounded-full group-hover:bg-accent/20 transition-colors">
                      <Quote className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 leading-relaxed mb-6 italic">
                        "{testimonial.text}"
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {testimonial.author}
                        </div>
                        <div className="text-sm text-gray-600">
                          {testimonial.role} • {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Company logos */}
          <div className="text-center">
            <p className="text-gray-600 mb-8">Empresas que confiam no KAVVI:</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {data.companies.map((company, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-center h-12 px-6 bg-gray-100 rounded-lg hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <span className="text-gray-700 font-medium">{company.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;