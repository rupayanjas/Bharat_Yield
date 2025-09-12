import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Sprout, 
  Upload, 
  Brain, 
  TrendingUp, 
  Droplets, 
  Thermometer,
  MapPin,
  Calendar,
  IndianRupee
} from "lucide-react";

interface CropRecommendation {
  crop: string;
  yield: string;
  profit: string;
  irrigation: string;
  fertilizer: string;
  confidence: number;
}

const CropAdvisor = () => {
  const [formData, setFormData] = useState({
    location: "",
    landSize: "",
    soilType: "",
    season: "",
    budget: "",
    previousCrop: "",
  });

  const [soilHealthData, setSoilHealthData] = useState({
    pH: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    organicCarbon: "",
  });

  const [recommendation, setRecommendation] = useState<CropRecommendation | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSoilCardUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate OCR processing
      setTimeout(() => {
        setSoilHealthData({
          pH: "6.8",
          nitrogen: "280",
          phosphorus: "15",
          potassium: "180",
          organicCarbon: "0.65",
        });
      }, 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setRecommendation({
        crop: "Rice (Basmati)",
        yield: "4.2 tons/hectare",
        profit: "₹85,000 per hectare",
        irrigation: "SRI Method - 7 day interval",
        fertilizer: "NPK 120:60:40 kg/ha",
        confidence: 94,
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <section id="advisor" className="py-20 bg-gradient-to-br from-background to-earth">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            AI Crop Advisor
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the best crop based on soil and weather data
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Input Form */}
          <Card className="shadow-field">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="h-5 w-5 text-primary" />
                Enter Crop Information
              </CardTitle>
              <CardDescription>
                Fill in your farm and soil details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Location */}
                <div>
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </Label>
                  <Input
                    placeholder="District, State"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>

                {/* Land Size */}
                <div>
                  <Label>Land Area (Hectares)</Label>
                  <Input
                    type="number"
                    placeholder="2.5"
                    value={formData.landSize}
                    onChange={(e) => setFormData({...formData, landSize: e.target.value})}
                  />
                </div>

                {/* Season */}
                <div>
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Season
                  </Label>
                  <Select value={formData.season} onValueChange={(value) => setFormData({...formData, season: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Season" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kharif">Kharif (June-November)</SelectItem>
                      <SelectItem value="rabi">Rabi (December-March)</SelectItem>
                      <SelectItem value="zaid">Zaid (April-June)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Budget */}
                <div>
                  <Label className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4" />
                    Budget (₹ per hectare)
                  </Label>
                  <Input
                    type="number"
                    placeholder="50000"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  />
                </div>

                {/* Soil Health Card Upload */}
                <div>
                  <Label className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Soil Health Card
                  </Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleSoilCardUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Or enter data manually
                  </p>
                </div>

                {/* Manual Soil Data */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>pH</Label>
                    <Input
                      placeholder="6.5"
                      value={soilHealthData.pH}
                      onChange={(e) => setSoilHealthData({...soilHealthData, pH: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Nitrogen (kg/ha)</Label>
                    <Input
                      placeholder="280"
                      value={soilHealthData.nitrogen}
                      onChange={(e) => setSoilHealthData({...soilHealthData, nitrogen: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Phosphorus (kg/ha)</Label>
                    <Input
                      placeholder="15"
                      value={soilHealthData.phosphorus}
                      onChange={(e) => setSoilHealthData({...soilHealthData, phosphorus: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Potassium (kg/ha)</Label>
                    <Input
                      placeholder="180"
                      value={soilHealthData.potassium}
                      onChange={(e) => setSoilHealthData({...soilHealthData, potassium: e.target.value})}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Brain className="h-5 w-5 mr-2 animate-spin" />
                      AI Analysis in Progress...
                    </>
                  ) : (
                    <>
                      <Brain className="h-5 w-5 mr-2" />
                      Get Crop Recommendation
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Recommendation Results */}
          <Card className="shadow-field">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                AI Recommendation Results
              </CardTitle>
              <CardDescription>
                Best crop choice for your farm
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recommendation ? (
                <div className="space-y-6">
                  {/* Confidence Score */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Confidence Score</span>
                    <Badge variant="default" className="bg-success">
                      {recommendation.confidence}% Accurate
                    </Badge>
                  </div>

                  {/* Recommended Crop */}
                  <div className="p-4 bg-gradient-to-r from-success/10 to-primary/10 rounded-lg border border-success/20">
                    <h3 className="text-xl font-bold text-success mb-2">
                      Recommended Crop: {recommendation.crop}
                    </h3>
                    <p className="text-muted-foreground">Best choice for your field conditions</p>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-3 bg-earth rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-success" />
                        <span className="font-medium">Expected Yield</span>
                      </div>
                      <span className="text-success font-bold">{recommendation.yield}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-earth rounded-lg">
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-5 w-5 text-saffron" />
                        <span className="font-medium">Estimated Profit</span>
                      </div>
                      <span className="text-saffron font-bold">{recommendation.profit}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-earth rounded-lg">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-sky" />
                        <span className="font-medium">Irrigation Plan</span>
                      </div>
                      <span className="text-sky font-bold text-sm">{recommendation.irrigation}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-earth rounded-lg">
                      <div className="flex items-center gap-2">
                        <Sprout className="h-5 w-5 text-primary" />
                        <span className="font-medium">Fertilizer Recommendation</span>
                      </div>
                      <span className="text-primary font-bold text-sm">{recommendation.fertilizer}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="saffron" className="flex-1">
                      Download Full Report
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Share in Community
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Ready for AI Recommendation
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Fill in your farm details to get crop suggestions
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CropAdvisor;