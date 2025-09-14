import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { ComprehensiveAnalysis, getComprehensiveAnalysis } from "@/utils/llmService";
import { generateCropRecommendationReport } from "@/utils/reportGenerator";
import { 
  Sprout, 
  Upload, 
  Brain, 
  TrendingUp, 
  Droplets, 
  MapPin,
  Calendar,
  IndianRupee,
  Loader2,
  Download,
  FileText,
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.mjs`;

interface CropRecommendation {
  crop: string;
  yield: string;
  profit: string;
  irrigation: string;
  fertilizer: string;
  confidence: number;
}

const CropAdvisor = () => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    location: "",
    landSize: "",
    soilType: "",
    season: "",
    budget: "",
    previousCrop: "",
    irrigationAvailable: "",
    soilHealthCard: null as File | null,
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
  
  // PDF processing states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [comprehensiveAnalysis, setComprehensiveAnalysis] = useState<ComprehensiveAnalysis | null>(null);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);

  // Validation states
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  // Validation functions
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'landSize':
        const landSize = parseFloat(value);
        if (value && (isNaN(landSize) || landSize < 0)) {
          return "Oops! Farm size can't be negative. Please enter a valid size.";
        }
        break;
      case 'budget':
        const budget = parseFloat(value);
        if (value && (isNaN(budget) || budget < 0)) {
          return "Oops! Budget can't be negative. Please enter a valid amount.";
        }
        break;
      case 'pH':
        const pH = parseFloat(value);
        if (value && (isNaN(pH) || pH < 0 || pH > 14)) {
          return "Oops! Looks like your soil pH is out of range. Please re-check (pH should be between 0–14).";
        }
        break;
      case 'nitrogen':
        const nitrogen = parseFloat(value);
        if (value && (isNaN(nitrogen) || nitrogen < 0 || nitrogen > 30000)) {
          return "Oops! Looks like your nitrogen data is out of range. Please re-check (0–30,000 kg/ha).";
        }
        break;
      case 'phosphorus':
        const phosphorus = parseFloat(value);
        if (value && (isNaN(phosphorus) || phosphorus < 2 || phosphorus > 80)) {
          return "Oops! Looks like your phosphorus data is out of range. Please re-check (2–80 kg/ha).";
        }
        break;
      case 'potassium':
        const potassium = parseFloat(value);
        if (value && (isNaN(potassium) || potassium < 50 || potassium > 900)) {
          return "Oops! Looks like your potassium data is out of range. Please re-check (50–900 kg/ha).";
        }
        break;
    }
    return '';
  };

  const handleFieldChange = (field: string, value: string) => {
    // Update form data
    if (field === 'pH' || field === 'nitrogen' || field === 'phosphorus' || field === 'potassium') {
      setSoilHealthData(prev => ({ ...prev, [field]: value }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Validate and update errors
    const error = validateField(field, value);
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  // Auto-fill user data if logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        location: user.location || "",
        landSize: user.farmSize || ""
      }));
    }
  }, [isAuthenticated, user]);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          
          // Load the PDF document
          const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
          let fullText = '';
          
          // Extract text from each page
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item) => {
                if ('str' in item) {
                  return (item as { str: string }).str;
                }
                return '';
              })
              .join(' ');
            fullText += pageText + '\n';
          }
          
          resolve(fullText.trim());
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  };


  const handleSoilCardUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please upload only PDF files.');
        return;
      }
      
      setUploadedFile(file);
      setIsProcessingPdf(true);
      
      try {
        // Extract text from PDF
        const text = await extractTextFromPDF(file);
        setExtractedText(text);
        
        // Text extracted successfully, will be used in comprehensive analysis
        
      } catch (error) {
        console.error('Error processing PDF:', error);
        alert('Error processing PDF. Please try again.');
      } finally {
        setIsProcessingPdf(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    try {
      // Get comprehensive analysis with all data
      const analysis = await getComprehensiveAnalysis(formData, extractedText, soilHealthData);
      setComprehensiveAnalysis(analysis);
      
      // Set recommendation for backward compatibility
      setRecommendation(analysis.cropRecommendation);
      
      // Update soil health data with analysis results
      setSoilHealthData({
        pH: analysis.soilHealth.pH !== "N/A" ? analysis.soilHealth.pH : soilHealthData.pH,
        nitrogen: analysis.soilHealth.nitrogen !== "N/A" ? analysis.soilHealth.nitrogen : soilHealthData.nitrogen,
        phosphorus: analysis.soilHealth.phosphorus !== "N/A" ? analysis.soilHealth.phosphorus : soilHealthData.phosphorus,
        potassium: analysis.soilHealth.potassium !== "N/A" ? analysis.soilHealth.potassium : soilHealthData.potassium,
        organicCarbon: analysis.soilHealth.organicCarbon !== "N/A" ? analysis.soilHealth.organicCarbon : soilHealthData.organicCarbon,
      });
      
    } catch (error) {
      console.error('Error getting comprehensive analysis:', error);
      // Fallback to basic recommendation
      setRecommendation({
        crop: "Rice (Basmati)",
        yield: "4.2 tons/acre",
        profit: "₹85,000 per acre",
        irrigation: "SRI Method - 7 day interval",
        fertilizer: "NPK 120:60:40 kg/ha",
        confidence: 75,
      });
    } finally {
      setIsAnalyzing(false);
    }
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
                  <Label>Farm Size (Acres)</Label>
                  <Input
                    type="number"
                    placeholder="2.5"
                    value={formData.landSize}
                    onChange={(e) => handleFieldChange('landSize', e.target.value)}
                    className={validationErrors.landSize ? 'border-red-500' : ''}
                  />
                  {validationErrors.landSize && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.landSize}</p>
                  )}
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
                    Budget (₹ per acre)
                  </Label>
                  <Input
                    type="number"
                    placeholder="50000"
                    value={formData.budget}
                    onChange={(e) => handleFieldChange('budget', e.target.value)}
                    className={validationErrors.budget ? 'border-red-500' : ''}
                  />
                  {validationErrors.budget && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.budget}</p>
                  )}
                </div>

                {/* Soil Health Card Upload */}
                <div>
                  <Label className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Soil Health Card
                  </Label>
                  <Input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleSoilCardUpload}
                    className="cursor-pointer"
                    disabled={isProcessingPdf}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload PDF soil health card or enter data manually
                  </p>
                  
                  {/* Processing Status */}
                  {isProcessingPdf && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        <span className="text-sm text-blue-700">
                          Extracting text from PDF...
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Uploaded File Info */}
                  {uploadedFile && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-700">
                          {uploadedFile.name} uploaded successfully
                        </span>
                      </div>
                    </div>
                  )}
                  
                </div>

                {/* Manual Soil Data */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>pH (0–14)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="6.5"
                      value={soilHealthData.pH}
                      onChange={(e) => handleFieldChange('pH', e.target.value)}
                      className={validationErrors.pH ? 'border-red-500' : ''}
                    />
                    {validationErrors.pH && (
                      <p className="text-sm text-red-500 mt-1">{validationErrors.pH}</p>
                    )}
                  </div>
                  <div>
                    <Label>Nitrogen (0–30000 kg/ha)</Label>
                    <Input
                      type="number"
                      placeholder="280"
                      value={soilHealthData.nitrogen}
                      onChange={(e) => handleFieldChange('nitrogen', e.target.value)}
                      className={validationErrors.nitrogen ? 'border-red-500' : ''}
                    />
                    {validationErrors.nitrogen && (
                      <p className="text-sm text-red-500 mt-1">{validationErrors.nitrogen}</p>
                    )}
                  </div>
                  <div>
                    <Label>Phosphorus (2–80 kg/ha)</Label>
                    <Input
                      type="number"
                      placeholder="15"
                      value={soilHealthData.phosphorus}
                      onChange={(e) => handleFieldChange('phosphorus', e.target.value)}
                      className={validationErrors.phosphorus ? 'border-red-500' : ''}
                    />
                    {validationErrors.phosphorus && (
                      <p className="text-sm text-red-500 mt-1">{validationErrors.phosphorus}</p>
                    )}
                  </div>
                  <div>
                    <Label>Potassium (50–900 kg/ha)</Label>
                    <Input
                      type="number"
                      placeholder="180"
                      value={soilHealthData.potassium}
                      onChange={(e) => handleFieldChange('potassium', e.target.value)}
                      className={validationErrors.potassium ? 'border-red-500' : ''}
                    />
                    {validationErrors.potassium && (
                      <p className="text-sm text-red-500 mt-1">{validationErrors.potassium}</p>
                    )}
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
              {comprehensiveAnalysis ? (
                <div className="space-y-6">
                  {/* Confidence Score */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Confidence Score</span>
                    <Badge variant="default" className="bg-success">
                      {comprehensiveAnalysis.cropRecommendation.confidence}% Accurate
                    </Badge>
                  </div>

                  {/* Recommended Crop */}
                  <div className="p-4 bg-gradient-to-r from-success/10 to-primary/10 rounded-lg border border-success/20">
                    <h3 className="text-xl font-bold text-success mb-2">
                      Recommended Crop: {comprehensiveAnalysis.cropRecommendation.crop}
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
                      <span className="text-success font-bold">{comprehensiveAnalysis.cropRecommendation.yield}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-earth rounded-lg">
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-5 w-5 text-saffron" />
                        <span className="font-medium">Estimated Profit</span>
                      </div>
                      <span className="text-saffron font-bold">{comprehensiveAnalysis.cropRecommendation.profit}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-earth rounded-lg">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-sky" />
                        <span className="font-medium">Irrigation Plan</span>
                      </div>
                      <span className="text-sky font-bold text-sm">{comprehensiveAnalysis.cropRecommendation.irrigation}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-earth rounded-lg">
                      <div className="flex items-center gap-2">
                        <Sprout className="h-5 w-5 text-primary" />
                        <span className="font-medium">Fertilizer Recommendation</span>
                      </div>
                      <span className="text-primary font-bold text-sm">{comprehensiveAnalysis.cropRecommendation.fertilizer}</span>
                    </div>
                  </div>

                  {/* AI Analysis Summary */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      AI Analysis Summary
                    </h4>
                    <div className="text-sm text-blue-800 mb-3">
                      {comprehensiveAnalysis.soilHealth.summary}
                    </div>
                    <div className="text-sm text-blue-800">
                      <strong>Detailed Analysis:</strong> {comprehensiveAnalysis.detailedAnalysis}
                    </div>
                  </div>

                  {/* Soil Health Recommendations */}
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Soil Health Recommendations:</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      {comprehensiveAnalysis.soilHealth.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Implementation Plan */}
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">Implementation Plan:</h4>
                    <ol className="text-sm text-purple-800 space-y-1">
                      {comprehensiveAnalysis.implementationPlan.map((step, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-purple-600 mt-1 font-medium">{index + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      variant="saffron" 
                      className="flex-1"
                      onClick={() => {
                        if (comprehensiveAnalysis) {
                          generateCropRecommendationReport(comprehensiveAnalysis, formData);
                        }
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
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