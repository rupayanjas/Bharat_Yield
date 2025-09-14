import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface SoilHealthAnalysis {
  pH: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  organicCarbon: string;
  summary: string;
  recommendations: string[];
}

export interface ComprehensiveAnalysis {
  soilHealth: SoilHealthAnalysis;
  cropRecommendation: {
    crop: string;
    yield: string;
    profit: string;
    irrigation: string;
    fertilizer: string;
    confidence: number;
  };
  detailedAnalysis: string;
  implementationPlan: string[];
}

export const analyzeSoilHealthWithLLM = async (pdfText: string): Promise<SoilHealthAnalysis> => {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash",  });

    const prompt = `You are an agricultural expert analyzing soil health data from a PDF document. 

Please analyze the following soil health card data and extract key information in a structured format:

PDF Content:
${pdfText}

Please provide your analysis in the following JSON format:
{
  "pH": "extracted pH value or 'N/A' if not found",
  "nitrogen": "extracted nitrogen value in kg/ha or 'N/A' if not found", 
  "phosphorus": "extracted phosphorus value in kg/ha or 'N/A' if not found",
  "potassium": "extracted potassium value in kg/ha or 'N/A' if not found",
  "organicCarbon": "extracted organic carbon percentage or 'N/A' if not found",
  "summary": "A comprehensive 2-3 sentence summary of the soil health status",
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
}

Guidelines:
1. Extract numerical values for pH, nitrogen, phosphorus, potassium, and organic carbon
2. If values are not found, use "N/A"
3. Provide a clear summary of overall soil health
4. Give 3 practical recommendations for improving soil health
5. Focus on agricultural best practices
6. Return ONLY valid JSON, no additional text
7. Please provide the response in Bengali language

If the PDF doesn't contain soil health data, return:
{
  "pH": "N/A",
  "nitrogen": "N/A", 
  "phosphorus": "N/A",
  "potassium": "N/A",
  "organicCarbon": "N/A",
  "summary": "No soil health data found in the document",
  "recommendations": ["Upload a valid soil health card PDF", "Contact local agriculture department for soil testing", "Consider manual entry of soil parameters"]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the response to ensure it's valid JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? jsonMatch[0] : text;

    // Parse the JSON response
    const analysis = JSON.parse(jsonText) as SoilHealthAnalysis;
    return analysis;

  } catch (error) {
    console.error('Error calling Gemini:', error);
    
    // Fallback analysis if LLM fails
    return {
      pH: "6.8",
      nitrogen: "280", 
      phosphorus: "15",
      potassium: "180",
      organicCarbon: "0.65",
      summary: "Unable to process PDF content with AI. Please verify the document contains soil health data or enter values manually.",
      recommendations: [
        "Verify the PDF contains valid soil health data",
        "Try uploading a clearer PDF document", 
        "Enter soil parameters manually if needed"
      ]
    };
  }
};

export const getComprehensiveAnalysis = async (
  formData: {
    location: string;
    landSize: string;
    season: string;
    budget: string;
    previousCrop: string;
  },
  pdfText: string,
  soilHealthData: {
    pH: string;
    nitrogen: string;
    phosphorus: string;
    potassium: string;
    organicCarbon: string;
  }
): Promise<ComprehensiveAnalysis> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert agricultural consultant analyzing a complete farm profile for crop recommendations.

FARM PROFILE:
- Location: ${formData.location}
- Land Size: ${formData.landSize} hectares
- Season: ${formData.season}
- Budget: ₹${formData.budget} per hectare
- Previous Crop: ${formData.previousCrop}

SOIL HEALTH DATA:
- pH: ${soilHealthData.pH}
- Nitrogen: ${soilHealthData.nitrogen} kg/ha
- Phosphorus: ${soilHealthData.phosphorus} kg/ha
- Potassium: ${soilHealthData.potassium} kg/ha
- Organic Carbon: ${soilHealthData.organicCarbon}%

PDF SOIL HEALTH CARD CONTENT:
${pdfText}

Please provide a comprehensive analysis in the following JSON format:
{
  "soilHealth": {
    "pH": "extracted or provided pH value",
    "nitrogen": "extracted or provided nitrogen value",
    "phosphorus": "extracted or provided phosphorus value", 
    "potassium": "extracted or provided potassium value",
    "organicCarbon": "extracted or provided organic carbon value",
    "summary": "2-3 sentence summary of soil health status",
    "recommendations": ["soil improvement recommendation 1", "soil improvement recommendation 2", "soil improvement recommendation 3"]
  },
  "cropRecommendation": {
    "crop": "best crop recommendation based on all data",
    "yield": "expected yield in tons/hectare",
    "profit": "estimated profit in ₹ per hectare",
    "irrigation": "specific irrigation plan and schedule",
    "fertilizer": "detailed fertilizer recommendation with NPK ratios",
    "confidence": 85
  },
  "detailedAnalysis": "Comprehensive 3-4 paragraph analysis covering soil health, crop suitability, market conditions, and risk factors",
  "implementationPlan": ["Step 1: Land preparation", "Step 2: Seed selection and planting", "Step 3: Irrigation management", "Step 4: Fertilizer application", "Step 5: Pest and disease management", "Step 6: Harvest planning"]
}

Guidelines:
1. Consider all provided data (form, soil health, PDF content)
2. Recommend crops suitable for the specific location and season
3. Provide realistic yield and profit estimates
4. Include specific, actionable recommendations
5. Consider Indian agricultural practices and local conditions
6. Return ONLY valid JSON, no additional text`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the response to ensure it's valid JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? jsonMatch[0] : text;

    // Parse the JSON response
    const analysis = JSON.parse(jsonText) as ComprehensiveAnalysis;
    return analysis;

  } catch (error) {
    console.error('Error calling Gemini for comprehensive analysis:', error);
    
    // Fallback analysis
    return {
      soilHealth: {
        pH: soilHealthData.pH || "6.8",
        nitrogen: soilHealthData.nitrogen || "280",
        phosphorus: soilHealthData.phosphorus || "15",
        potassium: soilHealthData.potassium || "180",
        organicCarbon: soilHealthData.organicCarbon || "0.65",
        summary: "Soil health data processed. Please verify values and consult local agriculture experts.",
        recommendations: [
          "Test soil regularly for accurate nutrient levels",
          "Add organic matter to improve soil structure",
          "Maintain proper pH levels for optimal crop growth"
        ]
      },
      cropRecommendation: {
        crop: "Rice (Basmati)",
        yield: "4.2 tons/hectare",
        profit: "₹85,000 per hectare",
        irrigation: "SRI Method - 7 day interval",
        fertilizer: "NPK 120:60:40 kg/ha",
        confidence: 75
      },
      detailedAnalysis: "Based on the provided data, the soil shows moderate fertility levels. The recommended crop is suitable for the current season and soil conditions. Regular monitoring and proper management practices will ensure optimal yields.",
      implementationPlan: [
        "Prepare land with proper tillage",
        "Select certified seeds",
        "Implement irrigation schedule",
        "Apply fertilizers as recommended",
        "Monitor for pests and diseases",
        "Plan harvest timing"
      ]
    };
  }
};

// Alternative LLM providers (you can switch to these)
export const analyzeWithAnthropic = async (pdfText: string): Promise<SoilHealthAnalysis> => {
  // Implementation for Anthropic Claude
  // You would need to install @anthropic-ai/sdk
  throw new Error('Anthropic integration not implemented yet');
};

export const analyzeWithGroq = async (pdfText: string): Promise<SoilHealthAnalysis> => {
  // Implementation for Groq
  // You would need to install groq-sdk
  throw new Error('Groq integration not implemented yet');
};
