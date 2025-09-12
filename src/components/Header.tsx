import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import bharatYieldLogo from "/lovable-uploads/16ad09f2-1a72-4fb4-b874-0ba14d1779d3.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { scrollToSection } from "@/utils/scrollToSection";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  const navItems = [
    { key: "Home", id: "home" },
    { key: "Crop Advisor", id: "advisor" },
    { key: "Weather", id: "weather" },
    { key: "Community", id: "community" },
    { key: "Government Schemes", id: "schemes" },
    { key: "Profit Calculator", id: "calculator" },
  ];

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-soft">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("home", () => setIsMenuOpen(false))}
            className="flex items-center space-x-3 cursor-pointer bg-transparent border-none"
          >
            <img src={bharatYieldLogo} alt="Bharat Yield" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold text-primary">Bharat Yield</h1>
              <p className="text-xs text-muted-foreground">Smart Farming Platform</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200 bg-transparent border-none"
              >
                {item.key}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="default"
              size="sm"
              onClick={() =>
                alert("Login functionality will be implemented with an authentication system")
              }
            >
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
            <nav className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id, () => setIsMenuOpen(false))}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors duration-200 bg-transparent border-none"
                >
                  {item.key}
                </button>
              ))}
              <div className="px-3 pt-4">
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() =>
                    alert("Login functionality will be implemented with an authentication system")
                  }
                >
                  <User className="h-4 w-4 mr-2" />
                  Login
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
