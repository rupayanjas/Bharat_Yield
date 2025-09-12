import React, { createContext, useContext, useState } from 'react';

interface LanguageContextType {
  language: 'hi' | 'en';
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  // Header
  'nav.home': { hi: 'होम', en: 'Home' },
  'nav.advisor': { hi: 'फसल सलाहकार', en: 'Crop Advisor' },
  'nav.weather': { hi: 'मौसम', en: 'Weather' },
  'nav.community': { hi: 'समुदाय', en: 'Community' },
  'nav.schemes': { hi: 'योजनाएं', en: 'Schemes' },
  'nav.login': { hi: 'लॉगिन', en: 'Login' },
  
  // Hero Section
  'hero.title1': { hi: 'स्मार्ट खेती का', en: 'Smart Farming\'s' },
  'hero.title2': { hi: 'डिजिटल भविष्य', en: 'Digital Future' },
  'hero.subtitle': { hi: 'AI-Powered Smart Farming for Better Yields', en: 'AI-Powered Smart Farming for Better Yields' },
  'hero.description': { hi: 'भारत यील्ड के साथ अपनी फसल उत्पादन को 10-20% तक बढ़ाएं। मिट्टी, मौसम और बाजार डेटा का उपयोग करके बेहतर निर्णय लें।', en: 'Increase your crop production by 10-20% with Bharat Yield. Make better decisions using soil, weather and market data.' },
  'hero.cta.start': { hi: 'फसल सलाह शुरू करें', en: 'Start Crop Advisory' },
  'hero.cta.demo': { hi: '▶ डेमो देखें', en: '▶ Watch Demo' },
  
  // Feature Cards
  'feature.ai.title': { hi: 'AI फसल सलाहकार', en: 'AI Crop Advisor' },
  'feature.ai.desc': { hi: 'बेहतर फसल और उत्पादन की भविष्यवाणी', en: 'Better crop and yield predictions' },
  'feature.profit.title': { hi: 'लाभ कैलकुलेटर', en: 'Profit Calculator' },
  'feature.profit.desc': { hi: 'वास्तविक समय मूल्य के साथ लाभ अनुमान', en: 'Profit estimation with real-time prices' },
  'feature.community.title': { hi: 'समुदायिक हब', en: 'Community Hub' },
  'feature.community.desc': { hi: 'किसानों के साथ ज्ञान साझा करें', en: 'Share knowledge with farmers' },
  'feature.schemes.title': { hi: 'सरकारी योजनाएं', en: 'Govt Schemes' },
  'feature.schemes.desc': { hi: 'सब्सिडी और अनुदान अलर्ट', en: 'Subsidy and grant alerts' },
  
  // Crop Advisor
  'advisor.title': { hi: 'AI फसल सलाहकार', en: 'AI Crop Advisor' },
  'advisor.subtitle': { hi: 'स्मार्ट खेती के लिए व्यक्तिगत सुझाव', en: 'Personalized recommendations for smart farming' },
  'advisor.location': { hi: 'स्थान', en: 'Location' },
  'advisor.location.placeholder': { hi: 'अपना जिला दर्ज करें', en: 'Enter your district' },
  'advisor.soil': { hi: 'मिट्टी का प्रकार', en: 'Soil Type' },
  'advisor.soil.clay': { hi: 'चिकनी मिट्टी', en: 'Clay Soil' },
  'advisor.soil.sandy': { hi: 'रेतीली मिट्टी', en: 'Sandy Soil' },
  'advisor.soil.loamy': { hi: 'दोमट मिट्टी', en: 'Loamy Soil' },
  'advisor.season': { hi: 'मौसम', en: 'Season' },
  'advisor.season.kharif': { hi: 'खरीफ', en: 'Kharif' },
  'advisor.season.rabi': { hi: 'रबी', en: 'Rabi' },
  'advisor.season.zaid': { hi: 'जायद', en: 'Zaid' },
  'advisor.analyze': { hi: 'विश्लेषण करें', en: 'Analyze' },
  'advisor.recommendation': { hi: 'सुझावित फसल', en: 'Recommended Crop' },
  'advisor.yield': { hi: 'अपेक्षित उत्पादन', en: 'Expected Yield' },
  'advisor.confidence': { hi: 'विश्वसनीयता', en: 'Confidence' },
  
  // Weather Dashboard
  'weather.title': { hi: 'मौसम डैशबोर्ड', en: 'Weather Dashboard' },
  'weather.subtitle': { hi: 'कृषि-केंद्रित मौसम पूर्वानुमान और अलर्ट', en: 'Agriculture-focused weather forecast and alerts' },
  'weather.today': { hi: 'आज का मौसम', en: 'Today\'s Weather' },
  'weather.humidity': { hi: 'नमी', en: 'Humidity' },
  'weather.wind': { hi: 'हवा की गति', en: 'Wind Speed' },
  'weather.uv': { hi: 'UV सूचकांक', en: 'UV Index' },
  'weather.forecast': { hi: '7-दिन का पूर्वानुमान', en: '7-Day Forecast' },
  'weather.alerts': { hi: 'कृषि अलर्ट', en: 'Agricultural Alerts' },
  'weather.alert.irrigation': { hi: 'सिंचाई की सलाह', en: 'Irrigation Advisory' },
  'weather.alert.irrigation.desc': { hi: 'अगले 3 दिनों में बारिश की संभावना कम है। सिंचाई की योजना बनाएं।', en: 'Low chance of rain in next 3 days. Plan irrigation accordingly.' },
  'weather.alert.pest': { hi: 'कीट चेतावनी', en: 'Pest Warning' },
  'weather.alert.pest.desc': { hi: 'उच्च नमी के कारण फंगल संक्रमण का खतरा। फसल की निगरानी करें।', en: 'Risk of fungal infection due to high humidity. Monitor crops closely.' },
  
  // Community Hub
  'community.title': { hi: 'किसान समुदाय हब', en: 'Farmer Community Hub' },
  'community.subtitle': { hi: 'ज्ञान साझा करें और अनुभवी किसानों से सीखें', en: 'Share knowledge and learn from experienced farmers' },
  'community.ask': { hi: 'प्रश्न पूछें', en: 'Ask Question' },
  'community.share': { hi: 'अनुभव साझा करें', en: 'Share Experience' },
  'community.recent': { hi: 'हाल की गतिविधि', en: 'Recent Activity' },
  'community.hot': { hi: 'लोकप्रिय चर्चा', en: 'Hot Discussions' },
  'community.expert': { hi: 'विशेषज्ञ सुझाव', en: 'Expert Tips' },
  
  // Profit Calculator
  'profit.title': { hi: 'लाभ कैलकुलेटर', en: 'Profit Calculator' },
  'profit.subtitle': { hi: 'अपनी फसल की लागत और लाभ का विश्लेषण करें', en: 'Analyze your crop cost and profit potential' },
  'profit.crop': { hi: 'फसल चुनें', en: 'Select Crop' },
  'profit.area': { hi: 'खेत का क्षेत्रफल (एकड़)', en: 'Farm Area (Acres)' },
  'profit.calculate': { hi: 'गणना करें', en: 'Calculate' },
  'profit.investment': { hi: 'कुल निवेश', en: 'Total Investment' },
  'profit.revenue': { hi: 'अपेक्षित आय', en: 'Expected Revenue' },
  'profit.net': { hi: 'शुद्ध लाभ', en: 'Net Profit' },
  'profit.roi': { hi: 'निवेश पर रिटर्न', en: 'Return on Investment' },
  
  // Footer
  'footer.about': { hi: 'हमारे बारे में', en: 'About Us' },
  'footer.contact': { hi: 'संपर्क', en: 'Contact' },
  'footer.support': { hi: 'सहायता', en: 'Support' },
  'footer.privacy': { hi: 'गोपनीयता नीति', en: 'Privacy Policy' },
  'footer.terms': { hi: 'नियम और शर्तें', en: 'Terms & Conditions' },
  'footer.copyright': { hi: '© 2024 भारत यील्ड। सभी अधिकार सुरक्षित।', en: '© 2024 Bharat Yield. All rights reserved.' }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'hi' | 'en'>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'hi' ? 'en' : 'hi');
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};