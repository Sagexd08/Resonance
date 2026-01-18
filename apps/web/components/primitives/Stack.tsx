import { Box, BoxProps } from "./Box";
import { cn } from "./Box";

export type StackProps = BoxProps & {
    direction?: "row" | "column";
    gap?: number | string; 
    align?: "start" | "center" | "end" | "stretch" | "baseline";
    justify?: "start" | "center" | "end" | "between" | "around";
    wrap?: boolean;
};

export function Stack({
    direction = "column",
    gap = 4, 
    align = "stretch",
    justify = "start",
    wrap = false,
    className,
    ...props
}: StackProps) {
    return (
        <Box
            className={cn(
                "flex",
                direction === "column" ? "flex-col" : "flex-row",
                wrap && "flex-wrap",

                
                
                
                gap === 0 && "gap-0",
                gap === 1 && "gap-4xs",
                gap === 2 && "gap-3xs",
                gap === 3 && "gap-2xs",
                gap === 4 && "gap-xs",
                gap === 5 && "gap-sm",
                gap === 6 && "gap-md",
                gap === 8 && "gap-lg",
                gap === 10 && "gap-xl",
                gap === 12 && "gap-2xl",

                
                align === "start" && "items-start",
                align === "center" && "items-center",
                align === "end" && "items-end",
                align === "stretch" && "items-stretch",
                align === "baseline" && "items-baseline",

                
                justify === "start" && "justify-start",
                justify === "center" && "justify-center",
                justify === "end" && "justify-end",
                justify === "between" && "justify-between",
                justify === "around" && "justify-around",

                className
            )}
            {...props}
        />
    );
}
