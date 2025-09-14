import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  IndianRupee,
  TrendingUp,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";

interface Scheme  {
    id: number;
    title: string;
    description: string;
    amount: string;
    eligibility: string;
    status: string;
    category: string;
    icon: any;
    documents: string[];
    benefits: string;
    lastDate: string;
    color: string;
    link: string;
  }

const GovernmentSchemes = () => {
  const schemes: Scheme[] = [
    {
      id: 1,
      title: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
      description: "Financial support of ₹6,000 per year to all small and marginal farmer families",
      amount: "₹6,000/year",
      eligibility: "All small and marginal farmers",
      status: "Active",
      category: "Financial Support",
      icon: FileText,
      documents: ["Aadhaar Card", "Bank Account", "Land Ownership Proof"],
      benefits: "Direct cash transfer in 3 installments of ₹2,000 each",
      lastDate: "Ongoing",
      color: "success",
      link: "https://pmkisan.gov.in"
    },
    {
      id: 2,
      title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
      description: "Comprehensive crop insurance scheme to protect farmers from production risks",
      amount: "Crop loss coverage (input cost)",
      eligibility: "All farmers growing notified crops",
      status: "Active",
      category: "Insurance",
      icon: FileText,
      documents: ["Aadhaar Card", "Land Records", "Crop Sowing Proof"],
      benefits: "Coverage against natural calamities, pests, and diseases",
      lastDate: "Ongoing",
      color: "success",
      link: "https://pmfby.gov.in"
    },
    {
      id: 3,
      title: "Pradhan Mantri Krishi Sinchai Yojana (PMKSY)",
      description: "Irrigation subsidy scheme to improve water use efficiency",
      amount: "Irrigation subsidy up to ₹1 lakh",
      eligibility: "Farmers in water-scarce areas",
      status: "Active",
      category: "Infrastructure",
      icon: FileText,
      documents: ["Land Records", "Aadhaar Card", "Project Proposal"],
      benefits: "Subsidy for drip, sprinkler and micro-irrigation systems",
      lastDate: "Ongoing",
      color: "success",
      link: "https://pmksy.gov.in"
    },
    {
      id: 4,
      title: "Soil Health Card Scheme",
      description: "Free soil testing and nutrient management recommendations for farmers",
      amount: "Free soil testing worth ₹500-1000",
      eligibility: "All farmers",
      status: "Active",
      category: "Advisory",
      icon: FileText,
      documents: ["Aadhaar Card", "Land Records"],
      benefits: "Soil analysis and customized fertilizer recommendations",
      lastDate: "Ongoing",
      color: "success",
      link: "https://soilhealth.dac.gov.in"
    },
    {
      id: 5,
      title: "Kisan Credit Card (KCC)",
      description: "Easy access to credit for farmers at concessional interest rates",
      amount: "Loan up to ₹3 lakh @ 4% interest",
      eligibility: "All farmers",
      status: "Active",
      category: "Credit",
      icon: FileText,
      documents: ["Aadhaar Card", "Land Ownership Proof", "Bank Account"],
      benefits: "Low interest rates, flexible repayment terms",
      lastDate: "Apply anytime",
      color: "success",
      link: "https://www.myscheme.gov.in/schemes/kcc"
    },
    {
      id: 6,
      title: "eNAM (National Agriculture Market)",
      description: "Digital trading platform for transparent price discovery",
      amount: "Digital trading access",
      eligibility: "Farmers and traders",
      status: "Active",
      category: "Marketing",
      icon: FileText,
      documents: ["Aadhaar Card", "Bank Account", "Mandi License"],
      benefits: "Online trading, better price realization, reduced transaction costs",
      lastDate: "Ongoing",
      color: "success",
      link: "https://enam.gov.in"
    },
    {
      id: 7,
      title: "Pradhan Mantri Kisan Maan Dhan Yojana (PM-KMY)",
      description: "Pension scheme for small and marginal farmers",
      amount: "₹3,000/month pension after 60",
      eligibility: "Small & marginal farmers (18–40 years)",
      status: "Active",
      category: "Social Security",
      icon: FileText,
      documents: ["Aadhaar Card", "Bank Account"],
      benefits: "Monthly pension after retirement, life insurance coverage",
      lastDate: "Ongoing",
      color: "success",
      link: "https://maandhan.in"
    },
    {
      id: 8,
      title: "Rashtriya Krishi Vikas Yojana (RKVY)",
      description: "Comprehensive scheme for holistic agricultural development",
      amount: "Grant support up to ₹25 lakh",
      eligibility: "State government projects for farmers",
      status: "Active",
      category: "Development",
      icon: FileText,
      documents: ["Proposal through State Government"],
      benefits: "Infrastructure development, technology adoption, capacity building",
      lastDate: "Ongoing",
      color: "success",
      link: "https://share.google/tb8vKjmd5ATs0SxBO"
    },
    {
      id: 9,
      title: "Paramparagat Krishi Vikas Yojana (PKVY)",
      description: "Support for organic farming practices and certification",
      amount: "₹50,000/ha over 3 years",
      eligibility: "Farmers adopting organic farming",
      status: "Active",
      category: "Organic Farming",
      icon: FileText,
      documents: ["Aadhaar Card", "Land Records"],
      benefits: "Financial support for organic inputs, certification assistance",
      lastDate: "Ongoing",
      color: "success",
      link: "https://share.google/t4OBahzTUnn7b0kEG"
    },
    {
      id: 10,
      title: "National Mission on Sustainable Agriculture",
      description: "Climate resilient agriculture and sustainable farming practices",
      amount: "Subsidy up to ₹1.5 lakh",
      eligibility: "Farmers in climate-vulnerable regions",
      status: "Active",
      category: "Sustainability",
      icon: FileText,
      documents: ["Aadhaar Card", "Project Plan", "Land Records"],
      benefits: "Support for climate-smart agriculture, water conservation",
      lastDate: "Ongoing",
      color: "success",
      link: "https://nmsa.dac.gov.in"
    },
    {
      id: 11,
      title: "National Beekeeping and Honey Mission (NBHM)",
      description: "Support for beekeeping and honey production activities",
      amount: "Support up to ₹2 lakh",
      eligibility: "Beekeepers and farmers",
      status: "Active",
      category: "Allied Agriculture",
      icon: FileText,
      documents: ["Aadhaar Card", "Land Records"],
      benefits: "Equipment subsidy, training, market linkage support",
      lastDate: "Ongoing",
      color: "success",
      link: "https://nbb.gov.in"
    },
    {
      id: 12,
      title: "National Dairy Plan (Phase II)",
      description: "Support for dairy farmers and milk production enhancement",
      amount: "₹50k–₹5 lakh support",
      eligibility: "Dairy farmers",
      status: "Active",
      category: "Animal Husbandry",
      icon: FileText,
      documents: ["Aadhaar Card", "Bank Details", "Livestock Proof"],
      benefits: "Cattle purchase subsidy, infrastructure development, training",
      lastDate: "Ongoing",
      color: "success",
      link: "https://nddb.coop"
    },
    {
      id: 13,
      title: "Digital Agriculture Mission (2021–25)",
      description: "Support for technology adoption in agriculture including drones and AI",
      amount: "Support for drones/AI ~₹5 lakh",
      eligibility: "Tech-driven farmers & startups",
      status: "Active",
      category: "Technology",
      icon: FileText,
      documents: ["Aadhaar Card", "FPO Registration", "Proposal"],
      benefits: "Drone subsidy, AI tools, digital farming solutions",
      lastDate: "Ongoing",
      color: "success",
      link: "https://share.google/Y1VCx5LUAn8e9QiIP"
    },
    {
      id: 14,
      title: "Sub-Mission on Agricultural Mechanization (SMAM)",
      description: "Subsidy on agricultural machinery and equipment purchase",
      amount: "Machinery subsidy 40–60%",
      eligibility: "All farmers",
      status: "Active",
      category: "Mechanization",
      icon: FileText,
      documents: ["Aadhaar Card", "Land Records", "Machinery Invoice"],
      benefits: "Tractor subsidy, implement subsidy, custom hiring centers",
      lastDate: "Ongoing",
      color: "success",
      link: "https://agrimachinery.nic.in"
    },
    {
      id: 15,
      title: "Mission for Integrated Development of Horticulture (MIDH)",
      description: "Comprehensive support for horticulture development and production",
      amount: "Grant up to ₹75,000/ha",
      eligibility: "Horticulture farmers",
      status: "Active",
      category: "Horticulture",
      icon: FileText,
      documents: ["Aadhaar Card", "Land Documents"],
      benefits: "Planting material subsidy, infrastructure support, market linkage",
      lastDate: "Ongoing",
      color: "success",
      link: "https://midh.gov.in"
    },
    {
      id: 16,
      title: "Pradhan Mantri Matsya Sampada Yojana (PMMSY)",
      description: "Comprehensive support for fisheries and aquaculture development",
      amount: "Support up to ₹40 lakh",
      eligibility: "Fisherfolk & aquaculture farmers",
      status: "Active",
      category: "Fisheries",
      icon: FileText,
      documents: ["Aadhaar Card", "Waterbody Ownership", "Proposal"],
      benefits: "Pond construction, equipment subsidy, marketing support",
      lastDate: "Ongoing",
      color: "success",
      link: "https://pmmsy.dof.gov.in"
    },
    {
      id: 17,
      title: "Gramin Bhandaran Yojana",
      description: "Subsidy for construction of rural warehouses and storage facilities",
      amount: "Warehouse subsidy 15–33%",
      eligibility: "Farmers & cooperatives",
      status: "Active",
      category: "Storage",
      icon: FileText,
      documents: ["Aadhaar Card", "Land Documents", "Warehouse Plan"],
      benefits: "Storage infrastructure, reduced post-harvest losses",
      lastDate: "Ongoing",
      color: "success",
      link: "https://nhb.gov.in"
    },
    {
      id: 18,
      title: "National Food Security Mission (NFSM)",
      description: "Support for increasing production of staple food crops",
      amount: "Input subsidy up to ₹10,000/ha",
      eligibility: "Farmers growing staples",
      status: "Active",
      category: "Food Security",
      icon: FileText,
      documents: ["Aadhaar Card", "Crop Proof"],
      benefits: "Seed subsidy, fertilizer support, technical guidance",
      lastDate: "Ongoing",
      color: "success",
      link: "https://nfsm.gov.in"
    },
    {
      id: 19,
      title: "Agri-Infra Fund",
      description: "Financial support for agricultural infrastructure development",
      amount: "Loan up to ₹2 crore @ 3%",
      eligibility: "FPOs, startups, agri-entrepreneurs",
      status: "Active",
      category: "Infrastructure",
      icon: FileText,
      documents: ["Aadhaar Card", "PAN Card", "Business Plan"],
      benefits: "Low interest loans, infrastructure development support",
      lastDate: "Ongoing",
      color: "success",
      link: "https://agriinfra.dac.gov.in"
    },
    {
      id: 20,
      title: "Digital Agriculture Mission",
      description: "Support for digital transformation in agriculture sector",
      amount: "Grant up to ₹10 lakh",
      eligibility: "Farmers & agri-tech startups",
      status: "Active",
      category: "Technology",
      icon: FileText,
      documents: ["Aadhaar Card", "Startup Registration", "Proposal"],
      benefits: "Digital tools, technology adoption, innovation support",
      lastDate: "Ongoing",
      color: "success",
      link: "https://agricoop.gov.in"
    }
  ];

  const [allSchemes, setAllSchemes] = useState<Scheme[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const schemesPerPage = 4;
  const totalPages = Math.ceil(schemes.length / schemesPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "success";
      case "Closed": return "destructive";
      case "Opening Soon": return "warning";
      default: return "secondary";
    }
  };

  const mockServer=async (): Promise<Scheme[]>=>{
    return new Promise((res)=>{
      setTimeout(() => {
        res(schemes)
      }, Math.random()*1000);
    });
  }

  useEffect(()=>{
    (async()=>{
      const data=await mockServer();
      setAllSchemes(data)
    })()
  },[])

  // Get current page schemes
  const getCurrentPageSchemes = () => {
    const startIndex = (currentPage - 1) * schemesPerPage;
    const endIndex = startIndex + schemesPerPage;
    return allSchemes.slice(startIndex, endIndex);
  };

  // Handle page navigation
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle Apply Now button click
  const handleApplyNow = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
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
            <h3 className="text-2xl font-bold text-success">{allSchemes.length}</h3>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto mb-12">
          {getCurrentPageSchemes().map((scheme) => (
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

                {/* Action Button */}
                <div className="pt-4">
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => handleApplyNow(scheme.link)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-4 mt-12">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(page)}
                className="w-10 h-10"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Page Info */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * schemesPerPage) + 1} to {Math.min(currentPage * schemesPerPage, allSchemes.length)} of {allSchemes.length} schemes
          </p>
        </div>

      </div>
    </section>
  );
};

export default GovernmentSchemes;