import { cn } from "@/lib/utils";

interface OptionSliderProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}

export function OptionSlider({ label, options, selected, onSelect }: OptionSliderProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 border",
              selected === option
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                : "bg-secondary/50 text-muted-foreground border-border hover:text-foreground hover:bg-secondary hover:border-primary/30"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
