import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface GrowthChartProps {
  predictions: { year: number; price: number }[];
}

const GrowthChart = ({ predictions }: GrowthChartProps) => (
  <div className="glass-card p-5">
    <h3 className="text-sm font-semibold text-foreground mb-4">5-Year Property Growth Forecast</h3>
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={predictions} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
        <XAxis dataKey="year" tick={{ fontSize: 11, fill: "hsl(215, 12%, 50%)" }} />
        <YAxis tick={{ fontSize: 11, fill: "hsl(215, 12%, 50%)" }} tickFormatter={v => `₹${v}L`} />
        <Tooltip
          contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 14%, 18%)", borderRadius: 8, fontSize: 12 }}
          formatter={(value: number) => [`₹${value} Lakhs`, "Predicted Value"]}
        />
        <Area type="monotone" dataKey="price" stroke="hsl(160, 60%, 45%)" fill="url(#growthGrad)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default GrowthChart;
