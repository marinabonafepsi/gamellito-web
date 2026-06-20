import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-display font-bold",
    "border-[3px] border-ink",
    "rounded-pill",
    "shadow-pop",
    "cursor-pointer select-none",
    "transition-[transform,box-shadow,background-color]",
    "duration-[120ms]",
    "ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E59C9] focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50 disabled:shadow-pop-sm",
    "hover:-translate-x-px hover:-translate-y-px hover:shadow-pop-lg",
    "active:translate-x-[3px] active:translate-y-[3px] active:shadow-pop-press",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        /* Gamellito cartoon variants */
        default:   "bg-[#F26A00] text-white hover:bg-[#D25A00]",
        sun:       "bg-[#FFC400] text-[#2B2233] hover:bg-[#E5A800]",
        lilac:     "bg-[#9B8CF0] text-white hover:bg-[#7B6BD0]",
        ghost:     "bg-white text-[#2B2233] hover:bg-[#FFF3C9]",
        ink:       "bg-[#2B2233] text-white hover:bg-[#3D3248]",
        /* Standard variants */
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:     "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-none border-2",
        secondary:   "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        link:        "border-transparent shadow-none underline-offset-4 hover:underline text-primary bg-transparent",
      },
      size: {
        sm:      "h-10 px-[18px] text-sm",
        default: "h-12 px-[26px] text-base",
        lg:      "h-14 px-[34px] text-lg",
        icon:    "h-12 w-12 p-0",
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
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
