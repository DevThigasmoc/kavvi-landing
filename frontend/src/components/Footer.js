import React from 'react';
import { MessageSquare, Mail, Phone, MapPin } from 'lucide-react';

const Footer = ({ data }) => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Main footer content */}
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{data.company.name}</h3>
                  <p className="text-gray-400 text-sm">WhatsApp-first CRM</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
                O CRM completo para equipes que vendem através do WhatsApp. 
                Centralize conversas, automatize processos e feche mais negócios.
              </p>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{data.company.address}</span>
              </div>
            </div>
            
            {/* Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Links Úteis</h4>
              <div className="space-y-3">
                {data.links.map((link, index) => (
                  <a 
                    key={index}
                    href={link.url}
                    className="block text-gray-300 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contato</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="w-4 h-4 text-accent" />
                  <span>contato@kavvicrm.com.br</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone className="w-4 h-4 text-accent" />
                  <span>+55 11 9999-9999</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <MessageSquare className="w-4 h-4 text-accent" />
                  <span>WhatsApp Business</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © 2025 {data.company.name}. Todos os direitos reservados.
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>Feito com ❤️ no Brasil</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Sistema online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;