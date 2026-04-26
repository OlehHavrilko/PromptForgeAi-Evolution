import { ComponentType } from "react";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  example: string;
  onClick: () => void;
}

export function TemplateCard({ title, description, icon: Icon, example, onClick }: TemplateCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-card/20",
        "hover:bg-card/50 hover:border-primary/30 transition-all duration-200 text-left"
      )}
    >
      <div className="p-1.5 rounded-md bg-secondary/80 text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-xs font-semibold text-foreground leading-tight group-hover:text-primary transition-colors truncate">
          {title}
        </h3>
        <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
          {description}
        </p>
      </div>
    </button>
  );
}
