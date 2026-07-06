import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-border bg-transparent text-foreground hover:bg-secondary hover:border-accent/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-secondary hover:text-secondary-foreground",
        link: "text-accent underline-offset-4 hover:underline",
        gold: "bg-accent text-accent-foreground hover:scale-105 shadow-[0_0_20px_hsl(43_65%_52%/0.2)] hover:shadow-[0_0_30px_hsl(43_65%_52%/0.3)]",
        "gold-outline": "border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground",
        hero: "bg-accent text-accent-foreground text-base px-8 py-4 hover:scale-105 shadow-[0_0_20px_hsl(43_65%_52%/0.2)] hover:shadow-[0_0_30px_hsl(43_65%_52%/0.3)] font-semibold tracking-wide",
        "hero-outline": "border-2 border-foreground/30 text-foreground hover:border-accent hover:text-accent bg-transparent backdrop-blur-sm",
        glass: "backdrop-blur-xl border border-border/30 bg-[hsl(160_35%_8%/0.7)] text-foreground hover:border-accent/50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-lg px-8",
        xl: "h-14 rounded-xl px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
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
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
