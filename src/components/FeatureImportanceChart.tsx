import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface FeatureImportanceChartProps {
  features: { feature: string; importance: number }[];
}

const COLORS = [
  "hsl(160, 60%, 45%)",
  "hsl(160, 50%, 50%)",
  "hsl(42, 90%, 55%)",
  "hsl(42, 80%, 50%)",
  "hsl(210, 80%, 55%)",
  "hsl(210, 60%, 50%)",
  "hsl(280, 50%, 55%)",
];

const FeatureImportanceChart = ({ features }: FeatureImportanceChartProps) => (
  <div className="glass-card p-5">
    <h3 className="text-sm font-semibold text-foreground mb-4">Random Forest — Feature Importance</h3>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={features} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
        <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(215, 12%, 50%)" }} domain={[0, 0.35]} />
        <YAxis type="category" dataKey="feature" tick={{ fontSize: 10, fill: "hsl(215, 12%, 50%)" }} width={130} />
        <Tooltip
          contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 14%, 18%)", borderRadius: 8, fontSize: 12 }}
          formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, "Importance"]}
        />
        <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
          {features.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default FeatureImportanceChart;
