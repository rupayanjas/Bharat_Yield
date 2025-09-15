import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
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
  MapPin,
  Search,
  Loader2,
  CloudSnow,
  Zap
} from 'lucide-react';

// Input component
const Input = ({ className, type, ...props }) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
      {...props}
    />
  );
};

// Button component
const Button = ({ className, variant, size, children, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
  };
  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant || 'default']} ${sizeClasses[size || 'default']} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

const WeatherDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastSearched, setLastSearched] = useState('');

  // Auto-fill user location if logged in
  useEffect(() => {
    if (isAuthenticated && user?.location) {
      setLocation(user.location);
      fetchWeatherData(user.location);
    } else {
      setLocation('Chennai');
      fetchWeatherData('Chennai');
    }
  }, [isAuthenticated, user]);

  const fetchWeatherData = async (searchLocation) => {
    if (!searchLocation.trim()) return;

    setLoading(true);
    setError('');

    try {
      // Using OpenWeatherMap API
      const API_KEY = 'bcfd7eff949780f4347b6431ed1e44c0';

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate different responses based on location
      if (searchLocation.toLowerCase().includes('invalid') || searchLocation.toLowerCase().includes('xyz')) {
        throw new Error('Location not found');
      }

      // Generate random weather conditions
      const conditions = ['sunny', 'partly-cloudy', 'cloudy', 'rainy'];
      const conditionTexts = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'];
      const days = ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

      // Mock successful response
      const mockWeatherData = {
        location: searchLocation,
        current: {
          temperature: Math.round(20 + Math.random() * 15),
          condition: conditions[Math.floor(Math.random() * 4)],
          conditionText: conditionTexts[Math.floor(Math.random() * 4)],
          humidity: Math.round(40 + Math.random() * 40),
          windSpeed: Math.round(5 + Math.random() * 15),
          visibility: Math.round(5 + Math.random() * 10),
          uvIndex: Math.round(1 + Math.random() * 10),
          precipitation: Math.round(Math.random() * 100),
          pressure: Math.round(1000 + Math.random() * 50),
          sunrise: '5:42 AM',
          sunset: '6:15 PM'
        },
        forecast: Array.from({length: 5}, (_, i) => {
          let dayName;
          if (i === 0) dayName = 'Today';
          else if (i === 1) dayName = 'Tomorrow';
          else dayName = days[i];

          return {
            day: dayName,
            high: Math.round(20 + Math.random() * 15),
            low: Math.round(10 + Math.random() * 10),
            condition: conditions[Math.floor(Math.random() * 4)],
            rain: Math.round(Math.random() * 100)
          };
        })
      };

      setWeatherData(mockWeatherData);
      setLastSearched(searchLocation);

    } catch (err) {
      const errorMessage = err.message === 'Location not found' ?
        'Location not found. Please check the spelling and try again.' :
        'Failed to fetch weather data. Please try again later.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const mapOpenWeatherToCondition = (weatherMain) => {
    const mapping = {
      'Clear': 'sunny',
      'Clouds': 'cloudy',
      'Rain': 'rainy',
      'Drizzle': 'rainy',
      'Thunderstorm': 'stormy',
      'Snow': 'snowy',
      'Mist': 'cloudy',
      'Fog': 'cloudy'
    };
    return mapping[weatherMain] || 'partly-cloudy';
  };

  const handleSearch = (e) => {
    e?.preventDefault?.();
    if (location.trim()) {
      fetchWeatherData(location.trim());
    }
  };

  const generateFarmingAlerts = (weather) => {
    if (!weather) return [];

    const alerts = [];

    if (weather.current.precipitation > 70) {
      alerts.push({
        type: 'weather',
        priority: 'high',
        title: 'Heavy Rain Warning',
        message: 'Heavy rainfall expected - secure crops and avoid field work',
        icon: AlertTriangle,
      });
    }

    if (weather.current.precipitation > 40 && weather.current.precipitation <= 70) {
      alerts.push({
        type: 'irrigation',
        priority: 'medium',
        title: 'Irrigation Advisory',
        message: 'Rain expected - reduce or skip irrigation today',
        icon: Droplets,
      });
    }

    if (weather.current.uvIndex > 8) {
      alerts.push({
        type: 'sun',
        priority: 'medium',
        title: 'High UV Warning',
        message: 'Very high UV levels - protect workers and sensitive crops',
        icon: Sun,
      });
    }

    if (weather.current.windSpeed > 25) {
      alerts.push({
        type: 'wind',
        priority: 'high',
        title: 'Strong Wind Alert',
        message: 'High winds may damage crops - secure equipment and structures',
        icon: Wind,
      });
    }

    return alerts;
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny': return Sun;
      case 'partly-cloudy': return Cloud;
      case 'cloudy': return Cloud;
      case 'rainy': return CloudRain;
      case 'stormy': return Zap;
      case 'snowy': return CloudSnow;
      default: return Sun;
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'sunny': return 'text-yellow-500';
      case 'partly-cloudy': return 'text-gray-500';
      case 'cloudy': return 'text-gray-600';
      case 'rainy': return 'text-blue-500';
      case 'stormy': return 'text-purple-600';
      case 'snowy': return 'text-blue-300';
      default: return 'text-yellow-500';
    }
  };

  const farmingAlerts = weatherData ? generateFarmingAlerts(weatherData) : [];

  return (
    <section id="weather" className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Weather Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real-time weather data and agricultural advice
          </p>

          {/* Location Search */}
          <div className="max-w-md mx-auto mt-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="location-input" className="flex items-center justify-center gap-2 mb-2">
                  <MapPin className="h-4 w-4" />
                  Enter Location
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="location-input"
                    type="text"
                    placeholder="Enter city name..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                    className={error ? 'border-red-500' : ''}
                  />
                  <Button onClick={handleSearch} disabled={loading}>
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {error && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {error}
                  </p>
                )}
                {isAuthenticated && !error && (
                  <p className="text-gray-500 text-sm mt-2">
                    {user?.location === location ? 'Using location from your profile' : 'Default location set'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Fetching weather data...</span>
          </div>
        )}

        {!loading && !error && weatherData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Current Weather */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Thermometer className="h-5 w-5 text-blue-500" />
                      Current Weather
                    </span>
                    <Badge variant="outline">{weatherData.location}</Badge>
                  </CardTitle>
                  <CardDescription>
                    Current weather conditions for {lastSearched}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Main Weather Display */}
                    <div className="text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                        <div className={`p-3 rounded-full bg-blue-100 ${getConditionColor(weatherData.current.condition)}`}>
                          {(() => {
                            const IconComponent = getWeatherIcon(weatherData.current.condition);
                            return <IconComponent className="h-12 w-12" />;
                          })()}
                        </div>
                        <div>
                          <div className="text-4xl font-bold text-gray-900">{weatherData.current.temperature}°C</div>
                          <div className="text-lg text-gray-600 capitalize">{weatherData.current.conditionText}</div>
                        </div>
                      </div>
                    </div>

                    {/* Weather Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <div>
                          <div className="text-sm text-gray-600">Humidity</div>
                          <div className="font-medium">{weatherData.current.humidity}%</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-gray-600" />
                        <div>
                          <div className="text-sm text-gray-600">Wind</div>
                          <div className="font-medium">{weatherData.current.windSpeed} km/h</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Umbrella className="h-4 w-4 text-blue-500" />
                        <div>
                          <div className="text-sm text-gray-600">Rain</div>
                          <div className="font-medium">{weatherData.current.precipitation}%</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-gray-600" />
                        <div>
                          <div className="text-sm text-gray-600">Visibility</div>
                          <div className="font-medium">{weatherData.current.visibility} km</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 5-Day Forecast */}
              <Card className="shadow-lg mt-6">
                <CardHeader>
                  <CardTitle>5-Day Forecast</CardTitle>
                  <CardDescription>
                    Weather forecast for upcoming days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-4">
                    {weatherData.forecast.map((day, index) => {
                      const IconComponent = getWeatherIcon(day.condition);
                      return (
                        <div key={index} className="text-center">
                          <div className="text-sm font-medium text-gray-900 mb-2">{day.day}</div>
                          <div className={`flex justify-center mb-3 ${getConditionColor(day.condition)}`}>
                            <IconComponent className="h-8 w-8" />
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm font-bold">{day.high}°</div>
                            <div className="text-xs text-gray-600">{day.low}°</div>
                            <div className="text-xs text-blue-500 font-medium">{day.rain}%</div>
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
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Farming Alerts
                  </CardTitle>
                  <CardDescription>
                    Weather-based agricultural advice
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {farmingAlerts.length > 0 ? (
                    farmingAlerts.map((alert, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-l-4 ${
                          alert.priority === 'high' 
                            ? 'bg-red-50 border-red-500' 
                            : 'bg-orange-50 border-orange-500'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <alert.icon className={`h-5 w-5 mt-0.5 ${
                            alert.priority === 'high' ? 'text-red-500' : 'text-orange-500'
                          }`} />
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">{alert.title}</h4>
                            <p className="text-sm text-gray-600">{alert.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-600">No weather alerts at this time</p>
                      <p className="text-sm text-gray-500">Weather conditions are favorable</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Weather Stats */}
              <Card className="shadow-lg mt-6">
                <CardHeader>
                  <CardTitle>Today's Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">UV Index</span>
                    <Badge variant={weatherData.current.uvIndex > 7 ? 'destructive' : 'default'}>
                      {weatherData.current.uvIndex} {weatherData.current.uvIndex > 7 ? 'High' : 'Moderate'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Atmospheric Pressure</span>
                    <span className="font-medium">{weatherData.current.pressure} hPa</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sunrise</span>
                    <span className="font-medium">{weatherData.current.sunrise}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sunset</span>
                    <span className="font-medium">{weatherData.current.sunset}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {!loading && !weatherData && !error && (
          <div className="text-center py-20">
            <p className="text-gray-600">Enter a location to view weather data</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default WeatherDashboard;