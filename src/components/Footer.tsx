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
    { name: "Scheme 1", href: "#schemes" },
    { name: "Scheme 2", href: "#schemes" },
    { name: "Scheme 3", href: "#schemes" },
  ];

  const supportLinks = [
    { name: "Contact Us", href: "#contact" },
    { name: "FAQs", href: "#faq" },
    { name: "Feedback", href: "#feedback" },
  ];

  return (
    <footer className="bg-background/95 border-t border-border py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Quick Links</h3>
          <ul className="space-y-3">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => scrollToSection(link.href.replace("#", ""))}
                  className="text-left w-full  hover:text-primary-foreground text-primary duration-200"
                >
                  {link.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Government Schemes */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Government Schemes</h3>
          <ul className="space-y-3">
            {govSchemes.map((scheme, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => scrollToSection(scheme.href.replace("#", ""))}
                  className="text-left w-full  hover:text-primary-foreground text-primary duration-200"
                >
                  {scheme.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Support & Contact */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Support & Contact</h3>
          <ul className="space-y-3">
            {supportLinks.map((link, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => scrollToSection(link.href.replace("#", ""))}
                  className="text-left w-full  hover:text-primary-foreground text-primary duration-200"
                >
                  {link.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Bharat Yield. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
