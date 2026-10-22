import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A2A5E] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-[#0A2A5E] text-white shadow-md hover:bg-[#133D82] hover:shadow-lg",
        accent:
          "bg-[#FF7A00] text-white shadow-md hover:bg-[#E66E00] hover:shadow-lg hover:-translate-y-0.5",
        secondary:
          "bg-[#E6F0FF] text-[#0A2A5E] hover:bg-[#D4E6FF] hover:text-[#0A2A5E]",
        outline:
          "border border-slate-300 bg-transparent text-[#1A1D23] hover:bg-slate-50 hover:border-slate-400",
        ghost:
          "text-[#1A1D23] hover:bg-slate-100 hover:text-[#0A2A5E]",
        link:
          "text-[#0A2A5E] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-3.5 text-xs",
        lg: "h-14 rounded-xl px-8 text-base font-bold",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
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
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

