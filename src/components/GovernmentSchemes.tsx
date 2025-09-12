import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  IndianRupee, 
  Users, 
  Calendar, 
  FileText, 
  CheckCircle, 
  ExternalLink,
  TrendingUp,
  Sprout,
  Droplets
} from "lucide-react";

const GovernmentSchemes = () => {
  const schemes = [
    {
      id: 1,
      title: "PM-KISAN Samman Nidhi",
      description: "Financial support of ₹6,000 per year to all farmer families",
      amount: "₹6,000/year",
      eligibility: "All farmer families with cultivable land",
      status: "Active",
      category: "Financial Support",
      icon: IndianRupee,
      documents: ["Aadhaar Card", "Land Records", "Bank Account"],
      benefits: "Direct cash transfer in 3 installments",
      lastDate: "Ongoing",
      color: "success"
    },
    {
      id: 2,
      title: "Pradhan Mantri Fasal Bima Yojana",
      description: "Crop insurance scheme to protect farmers from production risks",
      amount: "Up to ₹2 Lakh",
      eligibility: "All farmers growing notified crops",
      status: "Active",
      category: "Insurance",
      icon: Shield,
      documents: ["Aadhaar Card", "Land Records", "Bank Account", "Sowing Certificate"],
      benefits: "Coverage against natural calamities and crop loss",
      lastDate: "Before sowing season",
      color: "primary"
    },
    {
      id: 3,
      title: "Kisan Credit Card (KCC)",
      description: "Easy access to credit for farmers at concessional rates",
      amount: "Up to ₹3 Lakh",
      eligibility: "All farmers including tenant farmers",
      status: "Active", 
      category: "Credit",
      icon: FileText,
      documents: ["Aadhaar Card", "PAN Card", "Land Records", "Income Certificate"],
      benefits: "Low interest rates, flexible repayment",
      lastDate: "Apply anytime",
      color: "warning"
    },
    {
      id: 4,
      title: "PM Micro Irrigation Scheme",
      description: "Subsidy for drip and sprinkler irrigation systems",
      amount: "Up to 55% subsidy",
      eligibility: "All farmers with source of water",
      status: "Active",
      category: "Infrastructure",
      icon: Droplets,
      documents: ["Land Records", "Water Source Certificate", "Bank Account"],
      benefits: "Water conservation and increased productivity",
      lastDate: "March 31, 2024",
      color: "sky"
    },
    {
      id: 5,
      title: "Soil Health Card Scheme",
      description: "Free soil testing and nutrient management recommendations",
      amount: "Free",
      eligibility: "All farmers",
      status: "Active",
      category: "Advisory",
      icon: Sprout,
      documents: ["Aadhaar Card", "Land Records"],
      benefits: "Soil analysis and fertilizer recommendations",
      lastDate: "Ongoing",
      color: "earth"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "success";
      case "Closed": return "destructive";
      case "Opening Soon": return "warning";
      default: return "secondary";
    }
  };

  return (
    <section id="schemes" className="py-20 bg-gradient-to-br from-primary/5 to-success/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Government Schemes
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore various government schemes and subsidies available for farmers
          </p>
        </div>

        {/* Scheme Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
          <Card className="text-center p-6">
            <div className="flex items-center justify-center mb-3">
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-2xl font-bold text-success">150+</h3>
            <p className="text-sm text-muted-foreground">Active Schemes</p>
          </Card>
          <Card className="text-center p-6">
            <div className="flex items-center justify-center mb-3">
              <IndianRupee className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-primary">₹50,000 Cr</h3>
            <p className="text-sm text-muted-foreground">Total Budget</p>
          </Card>
          <Card className="text-center p-6">
            <div className="flex items-center justify-center mb-3">
              <Users className="h-8 w-8 text-saffron" />
            </div>
            <h3 className="text-2xl font-bold text-saffron">12 Cr+</h3>
            <p className="text-sm text-muted-foreground">Beneficiaries</p>
          </Card>
          <Card className="text-center p-6">
            <div className="flex items-center justify-center mb-3">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-2xl font-bold text-success">85%</h3>
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </Card>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {schemes.map((scheme) => (
            <Card key={scheme.id} className="shadow-field hover:shadow-harvest transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <scheme.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{scheme.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {scheme.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(scheme.status) as any}>
                    {scheme.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-success/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <IndianRupee className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium">Benefit Amount</span>
                    </div>
                    <div className="text-lg font-bold text-success">{scheme.amount}</div>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Apply By</span>
                    </div>
                    <div className="text-sm font-bold text-primary">{scheme.lastDate}</div>
                  </div>
                </div>

                {/* Eligibility */}
                <div>
                  <h4 className="font-medium text-foreground mb-2">Eligibility</h4>
                  <p className="text-sm text-muted-foreground">{scheme.eligibility}</p>
                </div>

                {/* Required Documents */}
                <div>
                  <h4 className="font-medium text-foreground mb-2">Required Documents</h4>
                  <div className="flex flex-wrap gap-2">
                    {scheme.documents.map((doc, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h4 className="font-medium text-foreground mb-2">Key Benefits</h4>
                  <p className="text-sm text-muted-foreground">{scheme.benefits}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button variant="default" className="flex-1">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Apply Now
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How to Apply Section */}
        <div className="mt-16">
          <Card className="max-w-4xl mx-auto shadow-field">
            <CardHeader>
              <CardTitle className="text-center">How to Apply for Government Schemes</CardTitle>
              <CardDescription className="text-center">
                Simple steps to get started with government schemes and subsidies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h4 className="font-medium mb-2">Check Eligibility</h4>
                  <p className="text-sm text-muted-foreground">Verify if you meet the scheme requirements</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h4 className="font-medium mb-2">Gather Documents</h4>
                  <p className="text-sm text-muted-foreground">Collect all required documents and certificates</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h4 className="font-medium mb-2">Submit Application</h4>
                  <p className="text-sm text-muted-foreground">Fill the form online or visit local office</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-medium mb-2">Track Status</h4>
                  <p className="text-sm text-muted-foreground">Monitor your application and receive benefits</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto p-8">
            <h3 className="text-xl font-bold text-foreground mb-4">Need Help with Applications?</h3>
            <p className="text-muted-foreground mb-6">
              Our experts can help you apply for the right schemes and maximize your benefits
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="default">
                Contact Expert
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Download Guide
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default GovernmentSchemes;