import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground rounded-xl hover:brightness-110 shadow-lg shadow-primary/25",
        destructive: "bg-destructive text-destructive-foreground rounded-xl hover:brightness-110 shadow-lg shadow-destructive/25",
        outline: "rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm text-foreground hover:bg-card/80 hover:border-border",
        secondary: "bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80",
        ghost: "rounded-xl hover:bg-secondary/60 text-foreground/80 hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground rounded-xl shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:brightness-105",
        glass: "rounded-xl backdrop-blur-xl bg-card/50 text-foreground border border-border/40 hover:bg-card/70 hover:border-border/60",
        macos: "bg-gradient-to-b from-[hsl(0_0%_22%)] to-[hsl(0_0%_16%)] text-foreground rounded-xl border border-[hsl(0_0%_28%)] shadow-md hover:from-[hsl(0_0%_26%)] hover:to-[hsl(0_0%_20%)]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg font-semibold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
