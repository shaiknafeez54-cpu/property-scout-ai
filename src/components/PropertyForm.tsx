import { useState } from "react";
import { motion } from "framer-motion";
import { INDIAN_CITIES, type PropertyInput } from "@/lib/analysisEngine";
import { Building2, MapPin, IndianRupee, Ruler, BedDouble, CalendarDays, Search } from "lucide-react";

interface PropertyFormProps {
  onAnalyze: (input: PropertyInput) => void;
  isAnalyzing: boolean;
}

const PropertyForm = ({ onAnalyze, isAnalyzing }: PropertyFormProps) => {
  const [form, setForm] = useState<PropertyInput>({
    city: "Mumbai",
    area: "",
    budget: 80,
    propertyType: "Apartment",
    size: 1200,
    bedrooms: 2,
    propertyAge: 3,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.area.trim()) return;
    onAnalyze(form);
  };

  const update = <K extends keyof PropertyInput>(key: K, value: PropertyInput[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="glass-card p-6 space-y-5"
    >
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Building2 className="w-5 h-5 text-primary" />
        Property Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* City */}
        <label className="space-y-1.5">
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> City
          </span>
          <select
            value={form.city}
            onChange={e => update("city", e.target.value)}
            className="w-full bg-secondary text-secondary-foreground rounded-lg px-3 py-2.5 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {INDIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        {/* Area */}
        <label className="space-y-1.5">
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> Area / Locality
          </span>
          <input
            type="text"
            value={form.area}
            onChange={e => update("area", e.target.value)}
            placeholder="e.g. Andheri West"
            required
            className="w-full bg-secondary text-secondary-foreground rounded-lg px-3 py-2.5 text-sm border border-border placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </label>

        {/* Budget */}
        <label className="space-y-1.5">
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5" /> Budget (₹ Lakhs)
          </span>
          <input
            type="number"
            value={form.budget}
            onChange={e => update("budget", Number(e.target.value))}
            min={5}
            max={10000}
            className="w-full bg-secondary text-secondary-foreground rounded-lg px-3 py-2.5 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
          />
        </label>

        {/* Property Type */}
        <label className="space-y-1.5">
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" /> Property Type
          </span>
          <div className="flex gap-2">
            {(["Apartment", "Villa", "Plot"] as const).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => update("propertyType", type)}
                className={`flex-1 py-2 text-sm rounded-lg border transition-all ${
                  form.propertyType === type
                    ? "bg-primary/15 border-primary text-primary font-medium"
                    : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </label>

        {/* Size */}
        <label className="space-y-1.5">
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Ruler className="w-3.5 h-3.5" /> Size (sqft)
          </span>
          <input
            type="number"
            value={form.size}
            onChange={e => update("size", Number(e.target.value))}
            min={200}
            max={50000}
            className="w-full bg-secondary text-secondary-foreground rounded-lg px-3 py-2.5 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
          />
        </label>

        {/* Bedrooms */}
        <label className="space-y-1.5">
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <BedDouble className="w-3.5 h-3.5" /> Bedrooms
          </span>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => update("bedrooms", n)}
                className={`flex-1 py-2 text-sm rounded-lg border transition-all ${
                  form.bedrooms === n
                    ? "bg-primary/15 border-primary text-primary font-medium"
                    : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {n} BHK
              </button>
            ))}
          </div>
        </label>

        {/* Property Age */}
        <label className="space-y-1.5 sm:col-span-2">
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" /> Property Age (years)
          </span>
          <input
            type="range"
            min={0}
            max={30}
            value={form.propertyAge}
            onChange={e => update("propertyAge", Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground font-mono">
            <span>New</span>
            <span className="text-primary font-semibold">{form.propertyAge} yrs</span>
            <span>30 yrs</span>
          </div>
        </label>
      </div>

      <button
        type="submit"
        disabled={isAnalyzing || !form.area.trim()}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        <Search className="w-4 h-4" />
        {isAnalyzing ? "Analyzing..." : "Run AI Analysis"}
      </button>
    </motion.form>
  );
};

export default PropertyForm;
