// Synthetic data engine and AI/ML simulation modules for Property Risk & Growth Analyzer
// All models run client-side with deterministic seeded randomness for consistent results

export interface PropertyInput {
  city: string;
  area: string;
  budget: number; // in lakhs
  propertyType: "Apartment" | "Villa" | "Plot";
  size: number; // sqft
  bedrooms: number;
  propertyAge: number; // years
}

export interface AnalysisResult {
  estimatedValue: number; // in lakhs
  valuationMetrics: { r2: number; mae: number };
  featureImportance: { feature: string; importance: number }[];
  crimeSafetyScore: number; // 0-10
  floodRiskProbability: number; // 0-100%
  pollutionRisk: "Low" | "Moderate" | "High";
  pollutionAQI: number;
  accessibilityScore: number; // 0-10
  accessibilityBreakdown: { factor: string; score: number }[];
  growthPredictions: { year: number; price: number }[];
  investmentScore: number; // 0-10
  recommendation: "STRONG BUY" | "MODERATE RISK" | "AVOID";
  appreciationPercent: number;
  priceFairnessIndex: number;
}

// ---- Deterministic seeded pseudo-random ----
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// ---- City/Area tier data for realistic scoring ----
const CITY_TIERS: Record<string, number> = {
  mumbai: 3, delhi: 3, bangalore: 3, hyderabad: 2.5, pune: 2.3,
  chennai: 2.2, kolkata: 2, ahmedabad: 1.8, jaipur: 1.5, lucknow: 1.3,
  chandigarh: 1.6, gurgaon: 2.8, noida: 2.4, thane: 2.2, navi_mumbai: 2.3,
  indore: 1.2, bhopal: 1.1, kochi: 1.4, vizag: 1.2, nagpur: 1.1,
};

function getCityMultiplier(city: string): number {
  const key = city.toLowerCase().replace(/[\s-]+/g, "_");
  return CITY_TIERS[key] || 1.2;
}

// ==========================
// MODULE 1: Fair Market Value Prediction (Random Forest Regressor simulation)
// ==========================
// Simulates a trained Random Forest model using feature engineering:
// - Encodes categorical features (propertyType, city tier)
// - Applies non-linear pricing curves based on size, bedrooms, age
// - Adds area-specific noise for realism
function predictMarketValue(input: PropertyInput, rng: () => number): {
  value: number;
  metrics: { r2: number; mae: number };
  featureImportance: { feature: string; importance: number }[];
} {
  const cityMul = getCityMultiplier(input.city);
  const typeMul = input.propertyType === "Villa" ? 1.4 : input.propertyType === "Apartment" ? 1.0 : 0.7;
  
  // Feature engineering: price per sqft base varies by city tier
  const basePricePerSqft = 3500 * cityMul * typeMul;
  
  // Non-linear size effect (diminishing returns above 2000 sqft)
  const sizeEffect = input.size <= 2000 
    ? input.size * basePricePerSqft 
    : 2000 * basePricePerSqft + (input.size - 2000) * basePricePerSqft * 0.85;
  
  // Bedroom premium
  const bedroomPremium = 1 + (input.bedrooms - 2) * 0.08;
  
  // Age depreciation (exponential decay)
  const ageDepreciation = Math.exp(-0.015 * input.propertyAge);
  
  // Area-specific variation
  const areaHash = hashString(input.area.toLowerCase());
  const areaVariation = 0.85 + (areaHash % 30) / 100;
  
  const estimatedPrice = (sizeEffect * bedroomPremium * ageDepreciation * areaVariation) / 100000; // convert to lakhs
  
  // Simulated model evaluation metrics
  const r2 = 0.87 + rng() * 0.08; // R² between 0.87-0.95
  const mae = estimatedPrice * (0.04 + rng() * 0.03); // MAE ~4-7% of value
  
  // Feature importance (simulated Random Forest feature_importances_)
  const importances = [
    { feature: "Location (City Tier)", importance: 0.28 + rng() * 0.05 },
    { feature: "Property Size (sqft)", importance: 0.22 + rng() * 0.04 },
    { feature: "Property Type", importance: 0.15 + rng() * 0.03 },
    { feature: "Number of Bedrooms", importance: 0.12 + rng() * 0.02 },
    { feature: "Property Age", importance: 0.10 + rng() * 0.02 },
    { feature: "Area Micro-market", importance: 0.08 + rng() * 0.02 },
    { feature: "Infrastructure Index", importance: 0.05 + rng() * 0.01 },
  ];
  
  // Normalize importances to sum to 1
  const total = importances.reduce((s, f) => s + f.importance, 0);
  importances.forEach(f => f.importance = Math.round((f.importance / total) * 100) / 100);
  importances.sort((a, b) => b.importance - a.importance);
  
  return { value: Math.round(estimatedPrice * 10) / 10, metrics: { r2: Math.round(r2 * 1000) / 1000, mae: Math.round(mae * 10) / 10 }, featureImportance: importances };
}

// ==========================
// MODULE 2: Crime Safety Score
// ==========================
// Uses area-wise crime dataset (synthetic). Normalizes raw crime index to 0-10 scale where 10 = safest.
function calculateCrimeSafety(city: string, area: string, rng: () => number): number {
  const cityBase = getCityMultiplier(city);
  // Higher tier cities have moderate crime, smaller cities can be safer
  const baseCrime = 5 + (3 - cityBase) * 1.5;
  const areaVariation = (hashString(area.toLowerCase()) % 20 - 10) / 10;
  const noise = (rng() - 0.5) * 0.5;
  const score = Math.max(1, Math.min(10, baseCrime + areaVariation + noise));
  return Math.round(score * 10) / 10;
}

// ==========================
// MODULE 3: Flood Risk Probability (Logistic Regression simulation)
// ==========================
// Logistic Regression is used because flood risk is a binary classification problem
// (flood / no flood). The sigmoid function maps continuous inputs to [0,1] probability.
// Inputs: simulated rainfall intensity, elevation data, historical flood frequency.
function calculateFloodRisk(city: string, area: string, rng: () => number): number {
  // Simulated feature values
  const rainfallIndex = 0.3 + rng() * 0.7; // 0-1 normalized
  const elevationFactor = rng() * 0.8; // lower = higher risk
  const floodHistory = rng() * 0.6;
  
  // Coastal/river cities have higher base flood risk
  const coastalCities = ["mumbai", "chennai", "kolkata", "kochi", "vizag"];
  const isCoastal = coastalCities.includes(city.toLowerCase().replace(/\s/g, ""));
  
  // Logistic regression: z = w1*x1 + w2*x2 + w3*x3 + bias
  const z = -1.5 + 2.0 * rainfallIndex - 1.8 * elevationFactor + 1.5 * floodHistory + (isCoastal ? 1.2 : 0);
  
  // Sigmoid function: P(flood) = 1 / (1 + e^(-z))
  const probability = 1 / (1 + Math.exp(-z));
  return Math.round(probability * 1000) / 10; // percentage with 1 decimal
}

// ==========================
// MODULE 4: Pollution Risk Analysis
// ==========================
// Uses AQI (Air Quality Index) dataset. Categorizes risk based on standard AQI breakpoints.
function analyzePollution(city: string, rng: () => number): { risk: "Low" | "Moderate" | "High"; aqi: number } {
  const pollutedCities: Record<string, number> = {
    delhi: 280, gurgaon: 240, noida: 250, lucknow: 200, kolkata: 180,
    mumbai: 140, pune: 110, bangalore: 90, hyderabad: 100, chennai: 95,
    chandigarh: 120, jaipur: 170, indore: 130, bhopal: 140, kochi: 60,
  };
  const key = city.toLowerCase().replace(/[\s-]+/g, "");
  const baseAQI = pollutedCities[key] || 120;
  const aqi = Math.round(baseAQI + (rng() - 0.5) * 60);
  
  const risk = aqi < 100 ? "Low" : aqi < 200 ? "Moderate" : "High";
  return { risk, aqi: Math.max(20, aqi) };
}

// ==========================
// MODULE 5: Infrastructure & Accessibility Scoring
// ==========================
// Evaluates proximity to essential infrastructure. Converts distance-based metrics
// to a normalized 0-10 accessibility index.
function scoreAccessibility(city: string, area: string, rng: () => number): {
  total: number;
  breakdown: { factor: string; score: number }[];
} {
  const cityMul = getCityMultiplier(city);
  const areaHash = hashString(area.toLowerCase());
  
  const factors = [
    { factor: "Schools & Education", base: 5 + cityMul + (areaHash % 3) },
    { factor: "Hospitals & Healthcare", base: 4.5 + cityMul * 0.8 + ((areaHash >> 2) % 3) },
    { factor: "Metro & Rail", base: 3 + cityMul * 1.2 + ((areaHash >> 4) % 2) },
    { factor: "Bus Transport", base: 5.5 + cityMul * 0.5 + ((areaHash >> 6) % 2) },
    { factor: "Markets & Shopping", base: 5 + cityMul * 0.7 + ((areaHash >> 8) % 3) },
  ];
  
  const breakdown = factors.map(f => ({
    factor: f.factor,
    score: Math.round(Math.min(10, Math.max(1, f.base + (rng() - 0.5) * 1.5)) * 10) / 10,
  }));
  
  const total = Math.round((breakdown.reduce((s, b) => s + b.score, 0) / breakdown.length) * 10) / 10;
  return { total, breakdown };
}

// ==========================
// MODULE 6: 5-Year Property Growth Prediction
// ==========================
// Uses historical price trends with regression-based forecasting.
// Applies city-tier growth rates and property-type appreciation curves.
function predictGrowth(estimatedValue: number, city: string, propertyType: string, rng: () => number): {
  predictions: { year: number; price: number }[];
  appreciationPercent: number;
} {
  const cityMul = getCityMultiplier(city);
  // Annual growth rate varies by city tier: metros 8-12%, tier2 6-9%, tier3 4-7%
  const baseGrowth = 0.04 + cityMul * 0.025;
  const typeBonus = propertyType === "Plot" ? 0.02 : propertyType === "Villa" ? 0.01 : 0;
  
  const currentYear = new Date().getFullYear();
  const predictions: { year: number; price: number }[] = [
    { year: currentYear, price: estimatedValue },
  ];
  
  let price = estimatedValue;
  for (let i = 1; i <= 5; i++) {
    const yearGrowth = baseGrowth + typeBonus + (rng() - 0.4) * 0.02;
    price = price * (1 + yearGrowth);
    predictions.push({ year: currentYear + i, price: Math.round(price * 10) / 10 });
  }
  
  const appreciationPercent = Math.round(((predictions[5].price - estimatedValue) / estimatedValue) * 1000) / 10;
  return { predictions, appreciationPercent };
}

// ==========================
// MODULE 7: Weighted Investment Scoring Engine
// ==========================
// Investment Score = (0.30 × Appreciation%) + (0.20 × Safety) + (0.15 × Accessibility)
//                  + (0.15 × Price Fairness) − (0.10 × Flood Risk%) − (0.10 × Pollution Risk)
function calculateInvestmentScore(
  appreciationPercent: number,
  safetyScore: number,
  accessibilityScore: number,
  priceFairnessIndex: number,
  floodRiskPercent: number,
  pollutionRisk: "Low" | "Moderate" | "High"
): { score: number; recommendation: "STRONG BUY" | "MODERATE RISK" | "AVOID" } {
  // Normalize appreciation to 0-10 (cap at 80% = 10)
  const appreciationNorm = Math.min(10, (appreciationPercent / 80) * 10);
  
  // Pollution risk to numeric (0-10 where 10 = worst)
  const pollutionNum = pollutionRisk === "Low" ? 2 : pollutionRisk === "Moderate" ? 5 : 8;
  
  // Normalize flood risk to 0-10
  const floodNorm = (floodRiskPercent / 100) * 10;
  
  const score = 
    0.30 * appreciationNorm +
    0.20 * safetyScore +
    0.15 * accessibilityScore +
    0.15 * priceFairnessIndex -
    0.10 * floodNorm -
    0.10 * pollutionNum;
  
  const normalizedScore = Math.round(Math.max(0, Math.min(10, score)) * 10) / 10;
  
  const recommendation = normalizedScore >= 7 ? "STRONG BUY" : normalizedScore >= 4.5 ? "MODERATE RISK" : "AVOID";
  
  return { score: normalizedScore, recommendation };
}

// ==========================
// MAIN ANALYSIS FUNCTION
// ==========================
export function analyzeProperty(input: PropertyInput): AnalysisResult {
  const seed = hashString(`${input.city}-${input.area}-${input.propertyType}-${input.size}-${input.bedrooms}`);
  const rng = seededRandom(seed);
  
  // Module 1: Market Value
  const valuation = predictMarketValue(input, rng);
  
  // Module 2: Crime Safety
  const crimeSafetyScore = calculateCrimeSafety(input.city, input.area, rng);
  
  // Module 3: Flood Risk
  const floodRiskProbability = calculateFloodRisk(input.city, input.area, rng);
  
  // Module 4: Pollution
  const pollution = analyzePollution(input.city, rng);
  
  // Module 5: Accessibility
  const accessibility = scoreAccessibility(input.city, input.area, rng);
  
  // Module 6: Growth Prediction
  const growth = predictGrowth(valuation.value, input.city, input.propertyType, rng);
  
  // Price Fairness Index: how close budget is to estimated value (10 = perfect match)
  const priceFairnessIndex = Math.round(Math.max(0, Math.min(10, 10 - Math.abs(input.budget - valuation.value) / valuation.value * 10)) * 10) / 10;
  
  // Module 7: Investment Score
  const investment = calculateInvestmentScore(
    growth.appreciationPercent,
    crimeSafetyScore,
    accessibility.total,
    priceFairnessIndex,
    floodRiskProbability,
    pollution.risk
  );
  
  return {
    estimatedValue: valuation.value,
    valuationMetrics: valuation.metrics,
    featureImportance: valuation.featureImportance,
    crimeSafetyScore,
    floodRiskProbability,
    pollutionRisk: pollution.risk,
    pollutionAQI: pollution.aqi,
    accessibilityScore: accessibility.total,
    accessibilityBreakdown: accessibility.breakdown,
    growthPredictions: growth.predictions,
    investmentScore: investment.score,
    recommendation: investment.recommendation,
    appreciationPercent: growth.appreciationPercent,
    priceFairnessIndex,
  };
}

// Available cities for the form dropdown
export const INDIAN_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Pune", "Chennai", "Kolkata",
  "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Gurgaon", "Noida",
  "Thane", "Navi Mumbai", "Indore", "Bhopal", "Kochi", "Vizag", "Nagpur",
];
