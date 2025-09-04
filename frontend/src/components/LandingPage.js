import React from 'react';
import { siteData } from '../data/site';
import HeroSection from './HeroSection';
import ViewsSection from './ViewsSection';
import FeaturesSection from './FeaturesSection';
import SocialProofSection from './SocialProofSection';
import UseCasesSection from './UseCasesSection';
import PricingSection from './PricingSection';
import FinalCtaSection from './FinalCtaSection';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection data={siteData.hero} />
      
      {/* Views Section */}
      <ViewsSection data={siteData.views} />
      
      {/* Features Section */}
      <FeaturesSection 
        whatsappFeatures={siteData.features}
        productivityFeatures={siteData.productivity}
      />
      
      {/* Social Proof Section */}
      <SocialProofSection data={siteData.socialProof} />
      
      {/* Use Cases Section */}
      <UseCasesSection data={siteData.useCases} />
      
      {/* Pricing Section */}
      <PricingSection data={siteData.pricing} />
      
      {/* Final CTA Section */}
      <FinalCtaSection data={siteData.finalCta} />
      
      {/* Footer */}
      <Footer data={siteData.footer} />
    </div>
  );
};

export default LandingPage;