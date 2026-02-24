import { motion } from "framer-motion";
import type { AnalysisResult, PropertyInput } from "@/lib/analysisEngine";
import ScoreCard from "./ScoreCard";
import GrowthChart from "./GrowthChart";
import FeatureImportanceChart from "./FeatureImportanceChart";
import AccessibilityBreakdown from "./AccessibilityBreakdown";
import { Shield, Droplets, Wind, MapPinned, TrendingUp, IndianRupee, Award, Activity } from "lucide-react";

interface DashboardProps {
  result: AnalysisResult;
  input: PropertyInput;
}

const Dashboard = ({ result, input }: DashboardProps) => {
  const recColor = result.recommendation === "STRONG BUY" ? "text-success" : result.recommendation === "MODERATE RISK" ? "text-warning" : "text-danger";
  const recBg = result.recommendation === "STRONG BUY" ? "bg-success/10 border-success/30" : result.recommendation === "MODERATE RISK" ? "bg-warning/10 border-warning/30" : "bg-danger/10 border-danger/30";

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
      {/* Hero recommendation */}
      <motion.div variants={fadeUp} className={`glass-card-glow p-6 border ${recBg} text-center`}>
        <div className="flex items-center justify-center gap-3 mb-2">
          <Award className={`w-8 h-8 ${recColor}`} />
          <span className={`font-mono text-4xl font-bold ${recColor}`}>
            {result.investmentScore}/10
          </span>
        </div>
        <p className={`text-xl font-bold ${recColor}`}>{result.recommendation}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {input.propertyType} in {input.area}, {input.city} · {input.size} sqft · {input.bedrooms} BHK
        </p>
      </motion.div>

      {/* Score cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div variants={fadeUp}>
          <ScoreCard
            icon={<IndianRupee className="w-5 h-5" />}
            label="Estimated Market Value"
            value={`₹${result.estimatedValue} L`}
            sublabel={`R² = ${result.valuationMetrics.r2} · MAE = ₹${result.valuationMetrics.mae}L`}
            color="primary"
          />
        </motion.div>
        <motion.div variants={fadeUp}>
          <ScoreCard
            icon={<Shield className="w-5 h-5" />}
            label="Crime Safety Score"
            value={`${result.crimeSafetyScore}/10`}
            sublabel={result.crimeSafetyScore >= 7 ? "Safe Area" : result.crimeSafetyScore >= 4 ? "Moderate Safety" : "High Crime Area"}
            color={result.crimeSafetyScore >= 7 ? "success" : result.crimeSafetyScore >= 4 ? "warning" : "danger"}
          />
        </motion.div>
        <motion.div variants={fadeUp}>
          <ScoreCard
            icon={<Droplets className="w-5 h-5" />}
            label="Flood Risk Probability"
            value={`${result.floodRiskProbability}%`}
            sublabel="Logistic Regression Model"
            color={result.floodRiskProbability <= 30 ? "success" : result.floodRiskProbability <= 60 ? "warning" : "danger"}
          />
        </motion.div>
        <motion.div variants={fadeUp}>
          <ScoreCard
            icon={<Wind className="w-5 h-5" />}
            label="Pollution Risk"
            value={result.pollutionRisk}
            sublabel={`AQI: ${result.pollutionAQI}`}
            color={result.pollutionRisk === "Low" ? "success" : result.pollutionRisk === "Moderate" ? "warning" : "danger"}
          />
        </motion.div>
        <motion.div variants={fadeUp}>
          <ScoreCard
            icon={<MapPinned className="w-5 h-5" />}
            label="Accessibility Score"
            value={`${result.accessibilityScore}/10`}
            sublabel="Infrastructure Index"
            color={result.accessibilityScore >= 7 ? "success" : result.accessibilityScore >= 4 ? "warning" : "danger"}
          />
        </motion.div>
        <motion.div variants={fadeUp}>
          <ScoreCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="5-Year Appreciation"
            value={`${result.appreciationPercent}%`}
            sublabel="Predicted Growth"
            color="primary"
          />
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={fadeUp}>
          <GrowthChart predictions={result.growthPredictions} />
        </motion.div>
        <motion.div variants={fadeUp}>
          <FeatureImportanceChart features={result.featureImportance} />
        </motion.div>
      </div>

      {/* Accessibility Breakdown */}
      <motion.div variants={fadeUp}>
        <AccessibilityBreakdown breakdown={result.accessibilityBreakdown} total={result.accessibilityScore} />
      </motion.div>

      {/* Investment Score Formula */}
      <motion.div variants={fadeUp} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-primary" /> Investment Score Breakdown
        </h3>
        <div className="font-mono text-xs text-muted-foreground space-y-1 leading-relaxed">
          <p className="text-foreground/80">Score = (0.30 × Appreciation) + (0.20 × Safety) + (0.15 × Accessibility) + (0.15 × Fairness) − (0.10 × Flood) − (0.10 × Pollution)</p>
          <p>
            = (0.30 × {(Math.min(10, (result.appreciationPercent / 80) * 10)).toFixed(1)}) + (0.20 × {result.crimeSafetyScore}) + (0.15 × {result.accessibilityScore}) + (0.15 × {result.priceFairnessIndex}) − (0.10 × {(result.floodRiskProbability / 10).toFixed(1)}) − (0.10 × {result.pollutionRisk === "Low" ? 2 : result.pollutionRisk === "Moderate" ? 5 : 8})
          </p>
          <p className="text-primary font-semibold text-sm">= {result.investmentScore}/10</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
