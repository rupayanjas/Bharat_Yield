import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { scrollToSection } from "@/utils/scrollToSection";

const Footer = () => {
  const { language, toggleLanguage, t } = useLanguage();

  // Define your footer sections
  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "Crop Advisor", href: "#advisor" },
    { name: "Weather", href: "#weather" },
    { name: "Community", href: "#community" },
    { name: "Profit Calculator", href: "#calculator" },
  ];

  const govSchemes = [
    { name: "PM-KISAN Samman Nidhi", href: "#schemes" },
    { name: "Pradhan Mantri Fasal Bima Yojana", href: "#schemes" },
    { name: "Kisan Credit Card (KCC)", href: "#schemes" },
  ];

  return (
    <footer className="bg-gradient-to-r from-primary/5 to-success/5 border-t border-border py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          
          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center justify-center md:justify-start gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(link.href.replace("#", ""))}
                    className="text-left w-full text-muted-foreground hover:text-primary hover:font-semibold transition-all duration-300 transform hover:translate-x-1"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Government Schemes */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center justify-center md:justify-start gap-2">
              <span className="w-2 h-2 bg-success rounded-full"></span>
              Government Schemes
            </h3>
            <ul className="space-y-4">
              {govSchemes.map((scheme, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(scheme.href.replace("#", ""))}
                    className="text-left w-full text-muted-foreground hover:text-success hover:font-semibold transition-all duration-300 transform hover:translate-x-1"
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
