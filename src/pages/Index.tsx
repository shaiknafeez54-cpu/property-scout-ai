import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropertyForm from "@/components/PropertyForm";
import Dashboard from "@/components/Dashboard";
import { analyzeProperty, type PropertyInput, type AnalysisResult } from "@/lib/analysisEngine";
import { Brain, Cpu } from "lucide-react";

const Index = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [input, setInput] = useState<PropertyInput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (formInput: PropertyInput) => {
    setIsAnalyzing(true);
    // Simulate processing delay for realism
    await new Promise(r => setTimeout(r, 1200));
    const analysisResult = analyzeProperty(formInput);
    setResult(analysisResult);
    setInput(formInput);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground leading-tight">AI Property Risk & Growth Analyzer</h1>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Cpu className="w-2.5 h-2.5" /> Random Forest · Logistic Regression · Time-Series Forecasting
              </p>
            </div>
          </div>
          {result && (
            <button
              onClick={() => { setResult(null); setInput(null); }}
              className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← New Analysis
            </button>
          )}
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              {/* Hero text */}
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                  <span className="text-gradient-brand">AI-Powered</span> Property Intelligence
                </h2>
                <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                  Evaluate any property in India using 7 AI modules — market valuation, safety analysis, flood risk, pollution scoring, accessibility indexing, growth forecasting, and investment scoring.
                </p>
              </div>
              <PropertyForm onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Dashboard result={result} input={input!} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading overlay */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground font-mono">Running AI models...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
