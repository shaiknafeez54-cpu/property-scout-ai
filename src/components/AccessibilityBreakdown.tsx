interface AccessibilityBreakdownProps {
  breakdown: { factor: string; score: number }[];
  total: number;
}

const AccessibilityBreakdown = ({ breakdown, total }: AccessibilityBreakdownProps) => (
  <div className="glass-card p-5">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-semibold text-foreground">Infrastructure & Accessibility</h3>
      <span className="font-mono text-lg font-bold text-primary">{total}/10</span>
    </div>
    <div className="space-y-3">
      {breakdown.map(item => {
        const pct = (item.score / 10) * 100;
        const barColor = item.score >= 7 ? "bg-success" : item.score >= 4 ? "bg-warning" : "bg-danger";
        return (
          <div key={item.factor}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">{item.factor}</span>
              <span className="font-mono text-foreground">{item.score}</span>
            </div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <div className={`h-full rounded-full ${barColor} transition-all duration-700`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default AccessibilityBreakdown;
