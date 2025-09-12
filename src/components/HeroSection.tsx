import { scrollToSection } from "@/utils/scrollToSection";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-green-50 to-green-100 px-4"
    >
      <h1 className="text-5xl md:text-6xl font-extrabold text-green-700 mb-6 leading-tight">
        Bharat Yield
      </h1>

      <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-8">
        Empowering farmers with <span className="font-semibold">data-driven insights</span> 
        for smarter decisions, higher yields, and sustainable growth.
      </p>

      <div className="flex space-x-4">
        <button
          onClick={() => scrollToSection("advisor")}
          className="px-6 py-3 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition"
        >
          Get Started
        </button>

        <button
          onClick={() => scrollToSection("weather")}
          className="px-6 py-3 border-2 border-green-600 text-green-700 rounded-xl hover:bg-green-50 transition"
        >
          Check Weather
        </button>
      </div>
    </section>
  );
}
