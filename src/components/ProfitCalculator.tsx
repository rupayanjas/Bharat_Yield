import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

// ✅ Gemini client for AI analysis
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

const ProfitCalculator = () => {
  const { user, isAuthenticated } = useAuth();

  const [aiAnalysis, setAiAnalysis] = useState<AIProfitAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);

  const [formData, setFormData] = useState({
    crop: "",
    district: "",
    landSize: "",
    expectedYield: "",
    marketPrice: "",
    seedCost: "",
    fertilizerCost: "",
    laborCost: "",
    irrigationCost: "",
    otherCosts: ""
  });

  const [calculation, setCalculation] = useState<ProfitCalculation | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // ✅ Auto-fill farm size from user profile
  useEffect(() => {
    if (isAuthenticated && user?.farmSize) {
      setFormData(prev => ({
        ...prev,
        landSize: user.farmSize
      }));
    }
  }, [isAuthenticated, user]);

  const validateField = (field: string, value: string): string => {
    const numValue = parseFloat(value);
    if (value && (isNaN(numValue) || numValue < 0)) {
      return "Value cannot be negative. Please enter a valid amount.";
    }
    return '';
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setValidationErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
  };

  // ✅ Call backend for yield prediction
  const predictYield = async () => {
    if (!formData.crop || !formData.district) return alert("Please enter crop and district.");

    try {
      setIsPredicting(true);
      const response = await fetch("/api/predict-yield", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop: formData.crop,
          district: formData.district
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch yield prediction");

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        expectedYield: data.predicted_yield.toFixed(2) // auto-fill predicted yield
      }));
    } catch (error) {
      console.error("Error predicting yield:", error);
      alert("Could not fetch yield prediction. Please enter manually.");
    } finally {
      setIsPredicting(false);
    }
  };

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

    const profitData: ProfitCalculation = {
      crop: formData.crop,
      totalRevenue,
      totalCost,
      netProfit: netProfit / landSize, // per acre
      profitMargin,
      roiPercentage,
      breakEvenYield,
    };

    setCalculation(profitData);

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

      const prompt = `
You are an agricultural economist analyzing crop profits.

DATA:
Crop: ${profitData.crop}
Total Revenue: ₹${profitData.totalRevenue}
Total Cost: ₹${profitData.totalCost}
Net Profit: ₹${profitData.netProfit}
Profit Margin: ${profitData.profitMargin.toFixed(1)}%
ROI: ${profitData.roiPercentage.toFixed(1)}%
Break-even Yield: ${profitData.breakEvenYield.toFixed(1)} quintal/acre

Provide JSON only:
{
  "marketInsights": "...",
  "costOptimization": ["...", "..."],
  "profitMaximization": ["...", "..."],
  "riskAssessment": "...",
  "recommendations": ["...", "..."],
  "marketTrends": "..."
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const jsonMatch = response.text().match(/\{[\s\S]*\}/);
      return JSON.parse(jsonMatch ? jsonMatch[0] : response.text());
    } catch (error) {
      console.error("AI Analysis Error:", error);
      return {
        marketInsights: "No AI insights available.",
        costOptimization: ["Reduce fertilizer costs", "Adopt drip irrigation"],
        profitMaximization: ["Use better seeds", "Adopt precision farming"],
        riskAssessment: "Consider crop diversification.",
        recommendations: ["Track market trends", "Use subsidies"],
        marketTrends: "Market data not available"
      };
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <section id="calculator" className="py-20 bg-gradient-to-br from-saffron/5 to-warning/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Profit Calculator</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Predict yield and calculate profits</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="shadow-field">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-saffron" />
                Enter Crop Information
              </CardTitle>
              <CardDescription>Fill in cost and production details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Crop Name + District */}
              <div>
                <Label>Crop</Label>
                <Input type="text" placeholder="Rice, Wheat..." value={formData.crop}
                  onChange={(e) => handleFieldChange('crop', e.target.value)} />
              </div>
              <div>
                <Label>District</Label>
                <Input type="text" placeholder="Enter district name" value={formData.district}
                  onChange={(e) => handleFieldChange('district', e.target.value)} />
              </div>

              {/* Predict Yield Button */}
              <Button variant="outline" onClick={predictYield} disabled={isPredicting || !formData.crop || !formData.district}>
                {isPredicting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : "Predict Yield"}
              </Button>

              {/* Land Size + Yield */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Farm Size (Acres)</Label>
                  <Input type="number" value={formData.landSize} onChange={(e) => handleFieldChange('landSize', e.target.value)} />
                </div>
                <div>
                  <Label>Expected Yield (Quintal/Acre)</Label>
                  <Input type="number" value={formData.expectedYield} onChange={(e) => handleFieldChange('expectedYield', e.target.value)} />
                </div>
              </div>

              {/* Market Price */}
              <div>
                <Label>Market Price (₹ per quintal)</Label>
                <Input type="number" value={formData.marketPrice} onChange={(e) => handleFieldChange('marketPrice', e.target.value)} />
              </div>

              {/* Costs */}
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Seed Cost</Label><Input type="number" value={formData.seedCost} onChange={(e) => handleFieldChange('seedCost', e.target.value)} /></div>
                <div><Label>Fertilizer Cost</Label><Input type="number" value={formData.fertilizerCost} onChange={(e) => handleFieldChange('fertilizerCost', e.target.value)} /></div>
                <div><Label>Labor Cost</Label><Input type="number" value={formData.laborCost} onChange={(e) => handleFieldChange('laborCost', e.target.value)} /></div>
                <div><Label>Irrigation Cost</Label><Input type="number" value={formData.irrigationCost} onChange={(e) => handleFieldChange('irrigationCost', e.target.value)} /></div>
              </div>

              <div>
                <Label>Other Costs</Label>
                <Input type="number" value={formData.otherCosts} onChange={(e) => handleFieldChange('otherCosts', e.target.value)} />
              </div>

              <Button onClick={calculateProfit} variant="saffron" size="lg" className="w-full"
                disabled={!formData.crop || !formData.landSize || !formData.expectedYield || !formData.marketPrice || isAnalyzing}>
                {isAnalyzing ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Analyzing...</> : "Calculate Profit"}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="shadow-field">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-success" /> Profit Analysis</CardTitle>
              <CardDescription>Financial breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {calculation ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                      <span className="text-sm font-medium">Total Revenue</span>
                      <div className="text-2xl font-bold text-success">{formatCurrency(calculation.totalRevenue)}</div>
                    </div>
                    <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                      <span className="text-sm font-medium">Total Cost</span>
                      <div className="text-2xl font-bold text-destructive">{formatCurrency(calculation.totalCost)}</div>
                    </div>
                  </div>
                  <div className={`p-6 rounded-lg border-2 ${calculation.netProfit > 0 ? 'bg-success/10 border-success' : 'bg-destructive/10 border-destructive'}`}>
                    <div className="text-center">
                      <h3 className="text-lg font-medium mb-2">{calculation.netProfit > 0 ? 'Net Profit' : 'Loss'}</h3>
                      <div className={`text-4xl font-bold ${calculation.netProfit > 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatCurrency(Math.abs(calculation.netProfit))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Per acre</p>
                    </div>
                  </div>
                  {aiAnalysis && (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 border rounded-lg"><h4>AI Insights</h4><p>{aiAnalysis.marketInsights}</p></div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12"><Calculator className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" /><h3>Ready for Profit Calculation</h3></div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProfitCalculator;