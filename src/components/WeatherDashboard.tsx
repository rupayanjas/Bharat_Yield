import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye,
  Umbrella,
  AlertTriangle,
  MapPin
} from "lucide-react";

// ✅ City-to-coordinates mapping for Open-Meteo API
const cityCoordinates: Record<string, { lat: number; lon: number }> = {
  "Chennai, Tamil Nadu": { lat: 13.0827, lon: 80.2707 },
  "Mumbai, Maharashtra": { lat: 19.076, lon: 72.8777 },
  "Delhi, Delhi": { lat: 28.7041, lon: 77.1025 },
  "Bangalore, Karnataka": { lat: 12.9716, lon: 77.5946 },
  "Kolkata, West Bengal": { lat: 22.5726, lon: 88.3639 },
  "Hyderabad, Telangana": { lat: 17.385, lon: 78.4867 },
  "Pune, Maharashtra": { lat: 18.5204, lon: 73.8567 },
  "Ahmedabad, Gujarat": { lat: 23.0225, lon: 72.5714 },
  "Jaipur, Rajasthan": { lat: 26.9124, lon: 75.7873 },
  "Surat, Gujarat": { lat: 21.1702, lon: 72.8311 },
  "Lucknow, Uttar Pradesh": { lat: 26.8467, lon: 80.9462 },
  "Kanpur, Uttar Pradesh": { lat: 26.4499, lon: 80.3319 },
  "Nagpur, Maharashtra": { lat: 21.1458, lon: 79.0882 },
  "Patna, Bihar": { lat: 25.5941, lon: 85.1376 },
  "Indore, Madhya Pradesh": { lat: 22.7196, lon: 75.8577 },
  "Bhopal, Madhya Pradesh": { lat: 23.2599, lon: 77.4126 },
  "Ludhiana, Punjab": { lat: 30.901, lon: 75.8573 },
  "Agra, Uttar Pradesh": { lat: 27.1767, lon: 78.0081 },
  "Vadodara, Gujarat": { lat: 22.3072, lon: 73.1812 },
  "Coimbatore, Tamil Nadu": { lat: 11.0168, lon: 76.9558 },
};

const WeatherDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState("Chennai, Tamil Nadu");
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);

  // Auto-fill location if user has profile location
  useEffect(() => {
    if (isAuthenticated && user?.location) {
      setSelectedLocation(user.location);
    }
  }, [isAuthenticated, user]);

  // Fetch weather data whenever location changes
  useEffect(() => {
    const fetchWeather = async () => {
      const coords = cityCoordinates[selectedLocation];
      if (!coords) return;

      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
        );
        const data = await res.json();

        // Current weather
        setCurrentWeather({
          location: selectedLocation,
          temperature: `${data.current.temperature_2m}°C`,
          condition: data.current.precipitation > 0 ? "rainy" : "sunny",
          conditionText: data.current.precipitation > 0 ? "Rainy" : "Clear",
          humidity: `${data.current.relative_humidity_2m}%`,
          windSpeed: `${data.current.wind_speed_10m} km/h`,
          precipitation: `${data.current.precipitation} mm`,
          visibility: "N/A", // Open-Meteo doesn’t provide this directly
          uvIndex: 6, // placeholder, as UV index not provided
          pressure: "N/A",
        });

        // Forecast (next 5 days)
        setForecast(
          data.daily.time.slice(0, 5).map((day: string, idx: number) => ({
            day: new Date(day).toLocaleDateString("en-IN", { weekday: "short" }),
            high: `${data.daily.temperature_2m_max[idx]}°C`,
            low: `${data.daily.temperature_2m_min[idx]}°C`,
            condition: data.daily.precipitation_sum[idx] > 0 ? "rainy" : "sunny",
            rain: `${data.daily.precipitation_sum[idx]} mm`,
          }))
        );
      } catch (err) {
        console.error("Weather fetch error:", err);
      }
    };

    fetchWeather();
  }, [selectedLocation]);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny": return Sun;
      case "partly-cloudy": return Cloud;
      case "cloudy": return Cloud;
      case "rainy": return CloudRain;
      default: return Sun;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "sunny": return "text-warning";
      case "partly-cloudy": return "text-muted-foreground";
      case "cloudy": return "text-muted-foreground";
      case "rainy": return "text-sky";
      default: return "text-warning";
    }
  };

  if (!currentWeather) {
    return <p className="text-center py-20">Loading weather data...</p>;
  }

  return (
    <section id="weather" className="py-20 bg-gradient-to-br from-sky/5 to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Weather Dashboard
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time weather data and agricultural advice
          </p>

          {/* Location Selector */}
          <div className="max-w-md mx-auto mt-8">
            <Label htmlFor="location-select" className="flex items-center justify-center gap-2 mb-2">
              <MapPin className="h-4 w-4" />
              Select Location
            </Label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your location" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(cityCoordinates).map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isAuthenticated && (
              <p className="text-sm text-muted-foreground mt-2">
                Auto-filled from your profile
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Current Weather */}
          <div className="lg:col-span-2">
            <Card className="shadow-field">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-sky" />
                    Current Weather
                  </span>
                  <Badge variant="outline">{currentWeather.location}</Badge>
                </CardTitle>
                <CardDescription>Current weather conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Main Weather Display */}
                  <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                      <div className={`p-3 rounded-full bg-sky/10 ${getConditionColor(currentWeather.condition)}`}>
                        <Cloud className="h-12 w-12" />
                      </div>
                      <div>
                        <div className="text-4xl font-bold text-foreground">{currentWeather.temperature}</div>
                        <div className="text-lg text-muted-foreground">{currentWeather.conditionText}</div>
                      </div>
                    </div>
                  </div>

                  {/* Weather Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-sky" />
                      <div>
                        <div className="text-sm text-muted-foreground">Humidity</div>
                        <div className="font-medium">{currentWeather.humidity}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Wind</div>
                        <div className="font-medium">{currentWeather.windSpeed}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Umbrella className="h-4 w-4 text-sky" />
                      <div>
                        <div className="text-sm text-muted-foreground">Rain</div>
                        <div className="font-medium">{currentWeather.precipitation}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Visibility</div>
                        <div className="font-medium">{currentWeather.visibility}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 5-Day Forecast */}
            <Card className="shadow-field mt-6">
              <CardHeader>
                <CardTitle>5-Day Forecast</CardTitle>
                <CardDescription>Weather for upcoming days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-4">
                  {forecast.map((day, index) => {
                    const IconComponent = getWeatherIcon(day.condition);
                    return (
                      <div key={index} className="text-center">
                        <div className="text-sm font-medium text-foreground mb-2">{day.day}</div>
                        <div className={`flex justify-center mb-3 ${getConditionColor(day.condition)}`}>
                          <IconComponent className="h-8 w-8" />
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-bold">{day.high}</div>
                          <div className="text-xs text-muted-foreground">{day.low}</div>
                          <div className="text-xs text-sky font-medium">{day.rain}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Farming Alerts */}
          <div>
            <Card className="shadow-field">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Farming Alerts
                </CardTitle>
                <CardDescription>Weather-based advice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg border-l-4 bg-warning/10 border-warning">
                  <div className="flex items-start gap-3">
                    <Droplets className="h-5 w-5 mt-0.5 text-warning" />
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Irrigation Advisory</h4>
                      <p className="text-sm text-muted-foreground">Rain expected - plan irrigation accordingly</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeatherDashboard;
