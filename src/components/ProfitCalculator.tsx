import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { profitCalculatorCrops } from "@/utils/cropOptions";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  BarChart3,
  Brain,
  Calculator,
  Coins,
  IndianRupee,
  Loader2,
  Target,
  TrendingDown,
  TrendingUp
} from "lucide-react";

interface ProfitCalculation {
  crop: string;
  totalRevenue: number;
  totalCost: number;
  netProfit: number;
  profitMargin: number;
  roiPercentage: number;
  breakEvenYield: number;
}

interface AIProfitAnalysis {
  marketInsights: string;
  costOptimization: string[];
  profitMaximization: string[];
  riskAssessment: string;
  recommendations: string[];
  marketTrends: string;
}

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

const ProfitCalculator = () => {
  const { user, isAuthenticated } = useAuth();
  const [aiAnalysis, setAiAnalysis] = useState<AIProfitAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    crop: "",
    landSize: "",
    expectedYield: "",
    sellingPrice: "",
    marketPrice: "",
    seedCost: "",
    fertilizerCost: "",
    laborCost: "",
    irrigationCost: "",
    otherCosts: ""
  });
  const [calculation, setCalculation] = useState<ProfitCalculation | null>(null);

  // Validation states
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  // Validation functions
  const validateField = (field: string, value: string): string => {
    const numValue = parseFloat(value);
    if (value && (isNaN(numValue) || numValue < 0)) {
      switch (field) {
        case 'landSize':
          return "Farm size cannot be negative. Please enter a valid size.";
        case 'expectedYield':
          return "Expected yield cannot be negative. Please enter a valid yield.";
        case 'marketPrice':
          return "Market price cannot be negative. Please enter a valid price.";
        case 'seedCost':
          return "Seed cost cannot be negative. Please enter a valid amount.";
        case 'fertilizerCost':
          return "Fertilizer cost cannot be negative. Please enter a valid amount.";
        case 'laborCost':
          return "Labor cost cannot be negative. Please enter a valid amount.";
        case 'irrigationCost':
          return "Irrigation cost cannot be negative. Please enter a valid amount.";
        case 'otherCosts':
          return "Other costs cannot be negative. Please enter a valid amount.";
        default:
          return "Value cannot be negative. Please enter a valid amount.";
      }
    }
    return '';
  };

  const handleFieldChange = (field: string, value: string) => {
    // Update form data
    setFormData(prev => ({ ...prev, [field]: value }));

    // Validate and update errors
    const error = validateField(field, value);
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  // Auto-fill farm size from user profile
  useEffect(() => {
    if (isAuthenticated && user?.farmSize) {
      setFormData(prev => ({
        ...prev,
        landSize: user.farmSize
      }));
    }
  }, [isAuthenticated, user]);


  const calculateProfit = async () => {
    const landSize = parseFloat(formData.landSize);
    const expectedYield = parseFloat(formData.expectedYield);
    const marketPrice = parseFloat(formData.marketPrice);

    const totalProduction = landSize * expectedYield;
    const totalRevenue = totalProduction * marketPrice;

    const totalCost =
      parseFloat(formData.seedCost || "0") +
      parseFloat(formData.fertilizerCost || "0") +
      parseFloat(formData.laborCost || "0") +
      parseFloat(formData.irrigationCost || "0") +
      parseFloat(formData.otherCosts || "0");

    const netProfit = totalRevenue - totalCost;
    const profitMargin = (netProfit / totalRevenue) * 100;
    const roiPercentage = (netProfit / totalCost) * 100;
    const breakEvenYield = totalCost / (marketPrice * landSize);

    const profitData = {
      crop: formData.crop,
      totalRevenue,
      totalCost,
      netProfit: parseFloat(`${netProfit/landSize}`), // per acre
      profitMargin,
      roiPercentage,
      breakEvenYield,
    };
    console.log(profitData)

    setCalculation(profitData);

    // Get AI analysis
    setIsAnalyzing(true);
    try {
      const analysis = await getAIProfitAnalysis(profitData);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Error getting AI analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getAIProfitAnalysis = async (profitData: ProfitCalculation): Promise<AIProfitAnalysis> => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are an expert agricultural economist and financial advisor analyzing crop profit data for Indian farmers.

PROFIT CALCULATION DATA:
- Crop: ${profitData.crop}
- Total Revenue: ₹${profitData.totalRevenue.toLocaleString()}
- Total Cost: ₹${profitData.totalCost.toLocaleString()}
- Net Profit: ₹${profitData.netProfit.toLocaleString()}
- Profit Margin: ${profitData.profitMargin.toFixed(1)}%
- ROI: ${profitData.roiPercentage.toFixed(1)}%
- Break-even Yield: ${profitData.breakEvenYield.toFixed(1)} quintal/hectare

FARM DETAILS:
- Land Size: ${formData.landSize} hectares
- Expected Yield: ${formData.expectedYield} quintal/hectare
- Market Price: ₹${formData.marketPrice} per quintal

COST BREAKDOWN:
- Seed Cost: ₹${formData.seedCost} per hectare
- Fertilizer Cost: ₹${formData.fertilizerCost} per hectare
- Labor Cost: ₹${formData.laborCost} per hectare
- Irrigation Cost: ₹${formData.irrigationCost} per hectare
- Other Costs: ₹${formData.otherCosts} per hectare

Please provide a comprehensive analysis in the following JSON format:
{
  "marketInsights": "2-3 sentence analysis of current market conditions and pricing for this crop",
  "costOptimization": ["specific cost reduction strategy 1", "specific cost reduction strategy 2", "specific cost reduction strategy 3"],
  "profitMaximization": ["yield improvement strategy 1", "yield improvement strategy 2", "yield improvement strategy 3"],
  "riskAssessment": "Analysis of potential risks and challenges for this crop",
  "recommendations": ["actionable recommendation 1", "actionable recommendation 2", "actionable recommendation 3"],
  "marketTrends": "Brief analysis of market trends and future outlook"
}

Guidelines:
1. Focus on Indian agricultural context and conditions
2. Provide specific, actionable advice
3. Consider government schemes and subsidies
4. Include sustainable farming practices
5. Address seasonal and regional factors
6. Return ONLY valid JSON, no additional text`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean up the response to ensure it's valid JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : text;

      // Parse the JSON response
      const analysis = JSON.parse(jsonText) as AIProfitAnalysis;
      return analysis;

    } catch (error) {
      console.error('Error getting AI profit analysis:', error);

      // Fallback analysis
      return {
        marketInsights: "Market analysis unavailable. Please consult local agricultural experts for current market conditions.",
        costOptimization: [
          "Consider bulk purchasing of inputs to reduce costs",
          "Explore government subsidy schemes for seeds and fertilizers",
          "Implement precision farming techniques to optimize resource use"
        ],
        profitMaximization: [
          "Use high-yield variety seeds",
          "Implement proper irrigation management",
          "Follow integrated pest management practices"
        ],
        riskAssessment: "Consider crop insurance and diversify your farming portfolio to manage risks effectively.",
        recommendations: [
          "Monitor market prices regularly",
          "Keep detailed cost records for better analysis",
          "Consult with local agriculture extension officers"
        ],
        marketTrends: "Market trends analysis unavailable. Please check local mandi rates and agricultural news."
      };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section id="calculator" className="py-20 bg-gradient-to-br from-saffron/5 to-warning/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Profit Calculator
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Calculate accurate cost and profit for your crops
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Input Form */}
          <Card className="shadow-field">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-saffron" />
                Enter Crop Information
              </CardTitle>
              <CardDescription>
                Fill in cost and production details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Crop Selection */}
              <div>
                <Label>Crop Name</Label>
                <Input
                  type="text"
                  placeholder="Enter crop name (e.g., Rice, Wheat, Sugarcane)"
                  value={formData.crop}
                  onChange={(e) => setFormData({...formData, crop: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <Label>Expected Yield (Quintal/Acre)</Label>
                  <Input
                    type="number"
                    placeholder="40"
                    value={formData.expectedYield}
                    onChange={(e) => handleFieldChange('expectedYield', e.target.value)}
                    className={validationErrors.expectedYield ? 'border-red-500' : ''}
                  />
                  {validationErrors.expectedYield && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.expectedYield}</p>
                  )}
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4" />
                  Market Price (₹ per quintal)
                </Label>
                <Input
                  type="number"
                  placeholder="2100"
                  value={formData.marketPrice}
                  onChange={(e) => handleFieldChange('marketPrice', e.target.value)}
                  className={validationErrors.marketPrice ? 'border-red-500' : ''}
                />
                {validationErrors.marketPrice && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.marketPrice}</p>
                )}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Cost Breakdown (₹ per acre)</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Seed Cost</Label>
                    <Input
                      type="number"
                      placeholder="5000"
                      value={formData.seedCost}
                      onChange={(e) => handleFieldChange('seedCost', e.target.value)}
                      className={validationErrors.seedCost ? 'border-red-500' : ''}
                    />
                    {validationErrors.seedCost && (
                      <p className="text-sm text-red-500 mt-1">{validationErrors.seedCost}</p>
                    )}
                  </div>
                  <div>
                    <Label>Fertilizer Cost</Label>
                    <Input
                      type="number"
                      placeholder="8000"
                      value={formData.fertilizerCost}
                      onChange={(e) => handleFieldChange('fertilizerCost', e.target.value)}
                      className={validationErrors.fertilizerCost ? 'border-red-500' : ''}
                    />
                    {validationErrors.fertilizerCost && (
                      <p className="text-sm text-red-500 mt-1">{validationErrors.fertilizerCost}</p>
                    )}
                  </div>
                  <div>
                    <Label>Labor Cost</Label>
                    <Input
                      type="number"
                      placeholder="12000"
                      value={formData.laborCost}
                      onChange={(e) => handleFieldChange('laborCost', e.target.value)}
                      className={validationErrors.laborCost ? 'border-red-500' : ''}
                    />
                    {validationErrors.laborCost && (
                      <p className="text-sm text-red-500 mt-1">{validationErrors.laborCost}</p>
                    )}
                  </div>
                  <div>
                    <Label>Irrigation Cost</Label>
                    <Input
                      type="number"
                      placeholder="3000"
                      value={formData.irrigationCost}
                      onChange={(e) => handleFieldChange('irrigationCost', e.target.value)}
                      className={validationErrors.irrigationCost ? 'border-red-500' : ''}
                    />
                    {validationErrors.irrigationCost && (
                      <p className="text-sm text-red-500 mt-1">{validationErrors.irrigationCost}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Other Costs (Machinery, Pesticides, etc.)</Label>
                  <Input
                    type="number"
                    placeholder="5000"
                    value={formData.otherCosts}
                    onChange={(e) => handleFieldChange('otherCosts', e.target.value)}
                    className={validationErrors.otherCosts ? 'border-red-500' : ''}
                  />
                  {validationErrors.otherCosts && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.otherCosts}</p>
                  )}
                </div>
              </div>

              <Button
                onClick={calculateProfit}
                variant="saffron"
                size="lg"
                className="w-full"
                disabled={!formData.crop || !formData.landSize || !formData.expectedYield || !formData.marketPrice || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    AI Analysis in Progress...
                  </>
                ) : (
                  <>
                    <Calculator className="h-5 w-5 mr-2" />
                    Calculate Profit with AI Analysis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="shadow-field">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-success" />
                Profit Analysis Report
              </CardTitle>
              <CardDescription>
                Financial breakdown of your crop
              </CardDescription>
            </CardHeader>
            <CardContent>
              {calculation ? (
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-success" />
                        <span className="text-sm font-medium">Total Revenue</span>
                      </div>
                      <div className="text-2xl font-bold text-success">
                        {formatCurrency(calculation.totalRevenue)}
                      </div>
                    </div>

                    <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="h-5 w-5 text-destructive" />
                        <span className="text-sm font-medium">Total Cost</span>
                      </div>
                      <div className="text-2xl font-bold text-destructive">
                        {formatCurrency(calculation.totalCost)}
                      </div>
                    </div>
                  </div>

                  {/* Net Profit */}
                  <div className={`p-6 rounded-lg border-2 ${
                    calculation.netProfit > 0 
                      ? 'bg-success/10 border-success' 
                      : 'bg-destructive/10 border-destructive'
                  }`}>
                    <div className="text-center">
                      <h3 className="text-lg font-medium mb-2">
                        {calculation.netProfit > 0 ? 'Net Profit' : 'Loss'}
                      </h3>
                      <div className={`text-4xl font-bold ${
                        calculation.netProfit > 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        {formatCurrency(Math.abs(calculation.netProfit))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Per acre {calculation.netProfit > 0 ? 'profit' : 'loss'}
                      </p>
                    </div>
                  </div>

                  {/* Financial Ratios */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Financial Ratios</h4>

                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between items-center p-3 bg-earth rounded-lg">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-saffron" />
                          <span className="font-medium">Profit Margin</span>
                        </div>
                        <span className={`font-bold ${
                          calculation.profitMargin > 0 ? 'text-success' : 'text-destructive'
                        }`}>
                          {calculation.profitMargin.toFixed(1)}%
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-earth rounded-lg">
                        <div className="flex items-center gap-2">
                          <Coins className="h-4 w-4 text-primary" />
                          <span className="font-medium">Return on Investment (ROI)</span>
                        </div>
                        <span className={`font-bold ${
                          calculation.roiPercentage > 0 ? 'text-success' : 'text-destructive'
                        }`}>
                          {calculation.roiPercentage.toFixed(1)}%
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-earth rounded-lg">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-sky" />
                          <span className="font-medium">Break-even Yield</span>
                        </div>
                        <span className="font-bold text-sky">
                          {calculation.breakEvenYield.toFixed(1)} quintal/acre
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Static Recommendations - Always Show */}
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <h4 className="font-medium text-primary mb-2">Static Analysis Recommendations</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {calculation.profitMargin < 20 && (
                        <li>• Use better seeds and techniques to increase yield</li>
                      )}
                      {calculation.roiPercentage < 30 && (
                        <li>• Utilize government schemes to reduce costs</li>
                      )}
                      {calculation.profitMargin > 30 && (
                        <li>• Excellent profit margin! Consider expanding production</li>
                      )}
                      {calculation.roiPercentage > 50 && (
                        <li>• Strong ROI! This crop is financially viable</li>
                      )}
                      <li>• Monitor market prices regularly</li>
                      <li>• Don't forget to get crop insurance</li>
                      <li>• Keep detailed cost records for future analysis</li>
                    </ul>
                  </div>

                  {/* AI Analysis */}
                  {aiAnalysis && (
                    <div className="space-y-4">
                      {/* Market Insights */}
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          AI Market Insights
                        </h4>
                        <div className="text-sm text-blue-800">
                          {aiAnalysis.marketInsights}
                        </div>
                      </div>

                      {/* Cost Optimization */}
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">AI Cost Optimization Strategies</h4>
                        <ul className="text-sm text-green-800 space-y-1">
                          {aiAnalysis.costOptimization.map((strategy, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-600 mt-1">•</span>
                              <span>{strategy}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Profit Maximization */}
                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <h4 className="font-medium text-purple-900 mb-2">AI Profit Maximization Strategies</h4>
                        <ul className="text-sm text-purple-800 space-y-1">
                          {aiAnalysis.profitMaximization.map((strategy, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-purple-600 mt-1">•</span>
                              <span>{strategy}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Risk Assessment */}
                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <h4 className="font-medium text-orange-900 mb-2">AI Risk Assessment</h4>
                        <div className="text-sm text-orange-800">
                          {aiAnalysis.riskAssessment}
                        </div>
                      </div>

                      {/* AI Recommendations */}
                      <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                        <h4 className="font-medium text-indigo-900 mb-2">AI Strategic Recommendations</h4>
                        <ul className="text-sm text-indigo-800 space-y-1">
                          {aiAnalysis.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-indigo-600 mt-1">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Market Trends */}
                      <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                        <h4 className="font-medium text-teal-900 mb-2">AI Market Trends & Outlook</h4>
                        <div className="text-sm text-teal-800">
                          {aiAnalysis.marketTrends}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AI Analysis Loading State */}
                  {isAnalyzing && (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        <span className="text-sm text-gray-700">
                          AI analysis in progress...
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button variant="default" className="flex-1">
                      Download Report
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Share in Community
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calculator className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Ready for Profit Calculation
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Fill in crop and cost information
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

export default ProfitCalculator;