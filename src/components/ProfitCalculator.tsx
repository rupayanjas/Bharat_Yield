import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  IndianRupee, 
  Calculator, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  BarChart3,
  Coins,
  Target
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

const ProfitCalculator = () => {
  const [calculation, setCalculation] = useState<ProfitCalculation | null>(null);
  const [formData, setFormData] = useState({
    crop: "",
    landSize: "",
    expectedYield: "",
    marketPrice: "",
    seedCost: "",
    fertilizerCost: "",
    laborCost: "",
    irrigationCost: "",
    otherCosts: "",
  });

  const cropPrices = {
    rice: { name: "Rice", price: 2100, unit: "per quintal" },
    wheat: { name: "Wheat", price: 2050, unit: "per quintal" },
    sugarcane: { name: "Sugarcane", price: 350, unit: "per quintal" },
    maize: { name: "Maize", price: 1850, unit: "per quintal" },
  };

  const handleCropChange = (crop: string) => {
    setFormData({
      ...formData,
      crop,
      marketPrice: cropPrices[crop as keyof typeof cropPrices]?.price.toString() || "",
    });
  };

  const calculateProfit = () => {
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

    setCalculation({
      crop: formData.crop,
      totalRevenue,
      totalCost,
      netProfit,
      profitMargin,
      roiPercentage,
      breakEvenYield,
    });
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
                <Label>Select Crop</Label>
                <Select value={formData.crop} onValueChange={handleCropChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a crop" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rice">Rice</SelectItem>
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="sugarcane">Sugarcane</SelectItem>
                    <SelectItem value="maize">Maize</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Land Area (Hectares)</Label>
                  <Input
                    type="number"
                    placeholder="2.5"
                    value={formData.landSize}
                    onChange={(e) => setFormData({...formData, landSize: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Expected Yield (Quintal/Hectare)</Label>
                  <Input
                    type="number"
                    placeholder="40"
                    value={formData.expectedYield}
                    onChange={(e) => setFormData({...formData, expectedYield: e.target.value})}
                  />
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
                  onChange={(e) => setFormData({...formData, marketPrice: e.target.value})}
                />
                {formData.crop && cropPrices[formData.crop as keyof typeof cropPrices] && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Current market rate: ₹{cropPrices[formData.crop as keyof typeof cropPrices].price} per quintal
                  </p>
                )}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Cost Breakdown (₹ per hectare)</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Seed Cost</Label>
                    <Input
                      type="number"
                      placeholder="5000"
                      value={formData.seedCost}
                      onChange={(e) => setFormData({...formData, seedCost: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Fertilizer Cost</Label>
                    <Input
                      type="number"
                      placeholder="8000"
                      value={formData.fertilizerCost}
                      onChange={(e) => setFormData({...formData, fertilizerCost: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Labor Cost</Label>
                    <Input
                      type="number"
                      placeholder="12000"
                      value={formData.laborCost}
                      onChange={(e) => setFormData({...formData, laborCost: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Irrigation Cost</Label>
                    <Input
                      type="number"
                      placeholder="3000"
                      value={formData.irrigationCost}
                      onChange={(e) => setFormData({...formData, irrigationCost: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label>Other Costs (Machinery, Pesticides, etc.)</Label>
                  <Input
                    type="number"
                    placeholder="5000"
                    value={formData.otherCosts}
                    onChange={(e) => setFormData({...formData, otherCosts: e.target.value})}
                  />
                </div>
              </div>

              <Button
                onClick={calculateProfit}
                variant="saffron"
                size="lg"
                className="w-full"
                disabled={!formData.crop || !formData.landSize || !formData.expectedYield || !formData.marketPrice}
              >
                <Calculator className="h-5 w-5 mr-2" />
                Calculate Profit
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
                        {calculation.netProfit > 0 ? '🎉 Net Profit' : '⚠️ Loss'}
                      </h3>
                      <div className={`text-4xl font-bold ${
                        calculation.netProfit > 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        {formatCurrency(Math.abs(calculation.netProfit))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Per hectare {calculation.netProfit > 0 ? 'profit' : 'loss'}
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
                          {calculation.breakEvenYield.toFixed(1)} quintal/hectare
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <h4 className="font-medium text-primary mb-2">💡 Recommendations</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {calculation.profitMargin < 20 && (
                        <li>• Use better seeds and techniques to increase yield</li>
                      )}
                      {calculation.roiPercentage < 30 && (
                        <li>• Utilize government schemes to reduce costs</li>
                      )}
                      <li>• Monitor market prices regularly</li>
                      <li>• Don't forget to get crop insurance</li>
                    </ul>
                  </div>

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