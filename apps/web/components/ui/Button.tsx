import { Box, BoxProps } from "../primitives/Box";
import { cn } from "../primitives/Box";
import { Loader2 } from "lucide-react";

export type ButtonVariant =
    | "primary"
    | "secondary"
    | "ghost"
    | "glass"
    | "energized"
    | "happy"
    | "neutral"
    | "drained";

export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = BoxProps & React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
};

export function Button({
    variant = "primary",
    size = "md",
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    className,
    disabled,
    ...props
}: ButtonProps) {
    return (
        <Box
            as="button"
            disabled={disabled || isLoading}
            className={cn(
                
                "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-fast ease-calm-out relative overflow-hidden",
                "focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:ring-offset-2 focus:ring-offset-bg-primary",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                "active:scale-[0.98]",

                
                size === "sm" && "h-8 px-3 text-body-sm",
                size === "md" && "h-10 px-4 text-body",
                size === "lg" && "h-12 px-6 text-body-lg",

                
                variant === "primary" && "bg-accent-primary text-white hover:bg-accent-primary-hover shadow-glow-soft hover:shadow-glow-medium",
                variant === "secondary" && "bg-surface-2 text-text-primary border border-surface-5 hover:bg-surface-3 hover:border-surface-4",
                variant === "ghost" && "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-2",
                variant === "glass" && "glass-light text-text-primary hover:bg-white/10 hover:border-white/20",

                
                variant === "energized" && "bg-emo-energized-base text-black/90 hover:bg-opacity-90 shadow-[0_0_20px_var(--emo-energized-glow)] hover:shadow-[0_0_30px_var(--emo-energized-glow)]",
                variant === "happy" && "bg-emo-happy-base text-black/90 hover:bg-opacity-90 shadow-[0_0_20px_var(--emo-happy-glow)] hover:shadow-[0_0_30px_var(--emo-happy-glow)]",
                variant === "neutral" && "bg-emo-neutral-base text-white hover:bg-opacity-90 shadow-[0_0_20px_var(--emo-neutral-glow)] hover:shadow-[0_0_30px_var(--emo-neutral-glow)]",
                variant === "drained" && "bg-emo-drained-base text-white hover:bg-opacity-90 shadow-[0_0_20px_var(--emo-drained-glow)] hover:shadow-[0_0_30px_var(--emo-drained-glow)]",

                className
            )}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {!isLoading && leftIcon}
            <span>{children}</span>
            {!isLoading && rightIcon}
        </Box>
    );
}
