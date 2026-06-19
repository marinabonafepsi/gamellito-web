import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const DOT_COLORS = ["#EE2B2B", "#37B6E6", "#8DC63F", "#F25CA2"];

const cardVariants = cva(
  [
    "relative",
    "border-[3px] border-ink",
    "rounded-lg",
    "shadow-pop",
    "p-6",
  ].join(" "),
  {
    variants: {
      surface: {
        white:  "bg-white",
        cream:  "bg-[#FFF3C9]",
        sun:    "bg-[#FFC400]",
        lilac:  "bg-[#9B8CF0] text-white",
        ink:    "bg-[#2B2233] text-white",
      },
      flat: {
        true: "shadow-none",
      },
    },
    defaultVariants: {
      surface: "white",
      flat: false,
    },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  halo?: boolean;
  dots?: boolean;
}

function Card({ className, surface, flat, halo, dots, children, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ surface, flat }), className)} {...props}>
      {dots && (
        <div
          className="absolute -top-3 right-4 flex gap-1.5 z-10"
          aria-hidden="true"
        >
          {DOT_COLORS.map((c, i) => (
            <span
              key={i}
              className="w-[18px] h-[18px] rounded-full border-2 border-ink inline-block"
              style={{ background: c }}
            />
          ))}
        </div>
      )}
      {halo ? (
        <div className="absolute inset-3 bg-[#FFF3C9] rounded-md z-0" aria-hidden="true" />
      ) : null}
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-display font-bold text-xl leading-snug", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted-foreground leading-relaxed", className)} {...props} />
  );
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center pt-4", className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
