import { ReactNode } from "react";

interface ScoreCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  sublabel: string;
  color: "primary" | "success" | "warning" | "danger";
}

const colorMap = {
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

const ScoreCard = ({ icon, label, value, sublabel, color }: ScoreCardProps) => (
  <div className="glass-card p-4 flex flex-col gap-2 h-full">
    <div className={`${colorMap[color]}`}>{icon}</div>
    <p className="text-xs text-muted-foreground leading-tight">{label}</p>
    <p className={`font-mono text-2xl font-bold ${colorMap[color]} animate-count-up`}>{value}</p>
    <p className="text-[11px] text-muted-foreground/70 mt-auto">{sublabel}</p>
  </div>
);

export default ScoreCard;
