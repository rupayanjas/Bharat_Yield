import { scrollToSection } from "@/utils/scrollToSection";
import heroFarmingImage from "@/assets/hero-farming.jpg";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative h-screen flex flex-col justify-center items-center text-center px-4"
      style={{
        backgroundImage: `url(${heroFarmingImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Content wrapper with higher z-index */}
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
          Smart Farming's
        </h1>
        <h1 className="text-5xl md:text-6xl font-extrabold text-orange-400 mb-6 leading-tight drop-shadow-lg">
          Digital Future
        </h1>

        <p className="text-xl md:text-2xl text-white mb-4 drop-shadow-md font-medium">
          AI-Powered Smart Farming for Better Yields
        </p>
        

        <div className="flex justify-center">
          <button
            onClick={() => scrollToSection("advisor")}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg flex items-center gap-2 transform hover:scale-105"
          >
            <span>🌱</span>
            Start Crop Advisory
          </button>
        </div>
      </div>
    </section>
  );
}
