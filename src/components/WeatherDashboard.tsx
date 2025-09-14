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

const WeatherDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState("");

  // Indian cities for location dropdown
  const indianCities = [
    "Chennai, Tamil Nadu",
    "Mumbai, Maharashtra", 
    "Delhi, Delhi",
    "Bangalore, Karnataka",
    "Kolkata, West Bengal",
    "Hyderabad, Telangana",
    "Pune, Maharashtra",
    "Ahmedabad, Gujarat",
    "Jaipur, Rajasthan",
    "Surat, Gujarat",
    "Lucknow, Uttar Pradesh",
    "Kanpur, Uttar Pradesh",
    "Nagpur, Maharashtra",
    "Patna, Bihar",
    "Indore, Madhya Pradesh",
    "Bhopal, Madhya Pradesh",
    "Ludhiana, Punjab",
    "Agra, Uttar Pradesh",
    "Vadodara, Gujarat",
    "Coimbatore, Tamil Nadu"
  ];

  // Auto-fill user location if logged in
  useEffect(() => {
    if (isAuthenticated && user?.location) {
      setSelectedLocation(user.location);
    } else {
      setSelectedLocation("Chennai, Tamil Nadu");
    }
  }, [isAuthenticated, user]);

  // Mock weather data - in real app, this would come from weather APIs
  const currentWeather = {
    location: selectedLocation || "Chennai, Tamil Nadu",
    temperature: "28°C",
    condition: "partly-cloudy",
    conditionText: "Partly Cloudy",
    humidity: "72%",
    windSpeed: "12 km/h",
    visibility: "8 km",
    uvIndex: 6,
    precipitation: "40%",
    pressure: "1012 hPa",
  };

  const forecast = [
    { day: "Today", high: "32°", low: "24°", condition: "sunny", rain: "10%" },
    { day: "Tomorrow", high: "30°", low: "22°", condition: "partly-cloudy", rain: "60%" },
    { day: "Day After", high: "27°", low: "20°", condition: "rainy", rain: "80%" },
    { day: "Sunday", high: "29°", low: "21°", condition: "cloudy", rain: "45%" },
    { day: "Monday", high: "31°", low: "23°", condition: "sunny", rain: "15%" },
  ];

  const farmingAlerts = [
    {
      type: "irrigation",
      priority: "medium",
      title: "Irrigation Advisory",
      message: "Rain expected in next 2 days - avoid irrigation",
      icon: Droplets,
    },
    {
      type: "weather",
      priority: "high", 
      title: "Weather Warning",
      message: "Heavy rain expected day after tomorrow - secure crops",
      icon: AlertTriangle,
    },
  ];

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
                {indianCities.map((city) => (
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
                <CardDescription>
                  Current weather conditions
                </CardDescription>
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
                <CardDescription>
                  Weather for upcoming days
                </CardDescription>
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
                <CardDescription>
                  Weather-based advice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {farmingAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.priority === "high" 
                        ? "bg-destructive/10 border-destructive" 
                        : "bg-warning/10 border-warning"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <alert.icon className={`h-5 w-5 mt-0.5 ${
                        alert.priority === "high" ? "text-destructive" : "text-warning"
                      }`} />
                      <div>
                        <h4 className="font-medium text-foreground mb-1">{alert.title}</h4>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Weather Stats */}
            <Card className="shadow-field mt-6">
              <CardHeader>
                <CardTitle>Today's Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">UV Index</span>
                  <Badge variant={currentWeather.uvIndex > 7 ? "destructive" : "default"}>
                    {currentWeather.uvIndex} {currentWeather.uvIndex > 7 ? "High" : "Moderate"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Atmospheric Pressure</span>
                  <span className="font-medium">{currentWeather.pressure}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Sunrise</span>
                  <span className="font-medium">5:42 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Sunset</span>
                  <span className="font-medium">6:15 PM</span>
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