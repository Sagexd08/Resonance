import { Box, BoxProps } from "./Box";
import { cn } from "./Box";

export type GlassSurfaceProps = BoxProps & {
    intensity?: "light" | "medium" | "heavy";
    interactive?: boolean;
};

export function GlassSurface({
    intensity = "medium",
    interactive = false,
    className,
    children,
    ...props
}: GlassSurfaceProps) {
    return (
        <Box
            className={cn(
                "rounded-2xl overflow-hidden relative transition-all duration-medium ease-calm-out",

                
                intensity === "light" && "glass-light",
                intensity === "medium" && "glass-medium",
                intensity === "heavy" && "glass-heavy",

                
                interactive && "hover:border-white/20 hover:shadow-glow-soft cursor-pointer active:scale-[0.99]",

                className
            )}
            {...props}
        >
            {}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/noise.png')] mix-blend-overlay" />

            {}
            <div className="relative z-10">
                {children}
            </div>
        </Box>
    );
}
