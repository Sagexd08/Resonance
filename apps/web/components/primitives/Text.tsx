import { Box, BoxProps } from "./Box";
import { cn } from "./Box";

export type TextVariant =
    | "display"
    | "h1" | "h2" | "h3" | "h4"
    | "body-lg" | "body" | "body-sm"
    | "caption" | "micro";

export type TextProps = BoxProps & {
    variant?: TextVariant;
    gradient?: "energized" | "happy" | "neutral" | "drained" | "burnout" | "none";
    as?: any;
};

export function Text({
    variant = "body",
    gradient = "none",
    className,
    as,
    ...props
}: TextProps) {

    const Component = as || (
        variant === "display" ? "h1" :
            variant === "h1" ? "h1" :
                variant === "h2" ? "h2" :
                    variant === "h3" ? "h3" :
                        variant === "h4" ? "h4" :
                            "p"
    );

    return (
        <Box
            as={Component}
            className={cn(
                
                "transition-colors duration-medium ease-calm-out",

                
                variant === "display" && "font-display text-text-display font-black tracking-tight leading-tight",
                variant === "h1" && "font-display text-h1 font-bold tracking-tight leading-tight",
                variant === "h2" && "font-display text-h2 font-semibold tracking-tight leading-snug",
                variant === "h3" && "font-display text-h3 font-semibold tracking-normal leading-snug",
                variant === "h4" && "font-display text-h4 font-medium tracking-normal leading-snug",
                variant === "body-lg" && "font-body text-body-lg font-normal leading-relaxed text-text-secondary",
                variant === "body" && "font-body text-body font-normal leading-relaxed text-text-secondary",
                variant === "body-sm" && "font-body text-body-sm font-normal leading-normal text-text-secondary",
                variant === "caption" && "font-body text-caption font-normal leading-normal text-text-tertiary uppercase tracking-wider",
                variant === "micro" && "font-mono text-micro font-medium leading-none text-text-tertiary uppercase tracking-widest",

                
                gradient === "energized" && "text-gradient-energized bg-clip-text text-transparent",
                gradient === "happy" && "text-gradient-happy bg-clip-text text-transparent",
                gradient === "neutral" && "text-gradient-neutral bg-clip-text text-transparent",
                gradient === "drained" && "text-gradient-drained bg-clip-text text-transparent",
                gradient === "burnout" && "text-gradient-burnout bg-clip-text text-transparent",

                className
            )}
            {...props}
        />
    );
}
