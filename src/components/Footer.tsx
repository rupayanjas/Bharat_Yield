import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { scrollToSection } from "@/utils/scrollToSection";

const Footer = () => {
  const { language, toggleLanguage, t } = useLanguage();

  // Define your footer sections
  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "AI Crop Advisor", href: "#advisor" },
    { name: "Weather", href: "#weather" },
    { name: "Community", href: "#community" },
    { name: "Profit Calculator", href: "#calculator" },
  ];

  const govSchemes = [
    { name: "PM-KISAN Samman Nidhi", href: "#schemes" },
    { name: "Pradhan Mantri Fasal Bima Yojana", href: "#schemes" },
    { name: "Kisan Credit Card (KCC)", href: "#schemes" },
    { name: "Soil Health Card", href: "#schemes" },
    { name: "PMFBY Insurance", href: "#schemes" },
  ];

  return (
    <footer className="bg-background/95 border-t border-border py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          
          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-foreground mb-6">Quick Navigation</h3>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(link.href.replace("#", ""))}
                    className="text-left w-full text-muted-foreground hover:text-primary hover:font-medium transition-all duration-300 text-lg"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Government Schemes */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-foreground mb-6">Government Schemes</h3>
            <ul className="space-y-4">
              {govSchemes.map((scheme, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(scheme.href.replace("#", ""))}
                    className="text-left w-full text-muted-foreground hover:text-primary hover:font-medium transition-all duration-300 text-lg"
                  >
                    {scheme.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Bharat Yield. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
