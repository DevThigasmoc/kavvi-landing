import React, { useState } from 'react';
import { Button } from './ui/button';
import { MessageSquare, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleTrialClick = () => {
    console.log('Header: Trial clicked');
    // Mock: abrir modal de cadastro
  };

  const handleDemoClick = () => {
    console.log('Header: Demo clicked');
    // Mock: abrir modal de agendamento
  };

  const navItems = [
    { name: 'Recursos', href: '#recursos' },
    { name: 'Preços', href: '#precos' },
    { name: 'Clientes', href: '#clientes' },
    { name: 'Suporte', href: '#suporte' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">KAVVI CRM</h1>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <a 
                key={index}
                href={item.href}
                className="text-gray-600 hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>
          
          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="ghost"
              className="text-primary hover:text-primary/80"
              onClick={handleDemoClick}
            >
              Agendar demo
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={handleTrialClick}
            >
              Teste grátis
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col gap-4">
              {navItems.map((item, index) => (
                <a 
                  key={index}
                  href={item.href}
                  className="text-gray-600 hover:text-primary transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                <Button 
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                  onClick={handleDemoClick}
                >
                  Agendar demo
                </Button>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white"
                  onClick={handleTrialClick}
                >
                  Teste grátis
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;