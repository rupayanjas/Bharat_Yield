import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CropAdvisor from "@/components/CropAdvisor";
import WeatherDashboard from "@/components/WeatherDashboard";
import CommunityHub from "@/components/CommunityHub";
import ProfitCalculator from "@/components/ProfitCalculator";
import GovernmentSchemes from "@/components/GovernmentSchemes";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";

const Index = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {/* Each component is wrapped in a section with a matching ID */}

          <section id="home" className="pt-16 -mt-16">
            <HeroSection />
          </section>

          <section id="advisor" className="pt-16 -mt-16">
            <CropAdvisor />
          </section>

          <section id="weather" className="pt-16 -mt-16">
            <WeatherDashboard />
          </section>
          
          <section id="community" className="pt-16 -mt-16">
            <CommunityHub />
          </section>
          
          <section id="schemes" className="pt-16 -mt-16">
            <GovernmentSchemes />
          </section>

          <section id="calculator" className="pt-16 -mt-16">
            <ProfitCalculator />
          </section>
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Index;
