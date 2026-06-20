import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex items-center rounded-pill",
    "border-[2px] border-ink",
    "px-3 py-0.5",
    "text-xs font-display font-bold",
    "shadow-pop-sm",
    "transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  ].join(" "),
  {
    variants: {
      variant: {
        default:     "bg-[#F26A00] text-white border-[#2B2233]",
        sun:         "bg-[#FFC400] text-[#2B2233] border-[#2B2233]",
        lilac:       "bg-[#9B8CF0] text-white border-[#2B2233]",
        cream:       "bg-[#FFF3C9] text-[#2B2233] border-[#2B2233]",
        ink:         "bg-[#2B2233] text-white border-[#2B2233]",
        "game-red":  "bg-[#EE2B2B] text-white border-[#2B2233]",
        "game-blue": "bg-[#37B6E6] text-[#2B2233] border-[#2B2233]",
        "game-green":"bg-[#8DC63F] text-[#2B2233] border-[#2B2233]",
        secondary:   "bg-secondary text-secondary-foreground border-[#2B2233]",
        destructive: "bg-destructive text-destructive-foreground border-[#2B2233]",
        outline:     "bg-transparent text-foreground border-[#2B2233] shadow-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
