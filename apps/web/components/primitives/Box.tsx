import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export type BoxProps = React.HTMLAttributes<HTMLElement> & {
    as?: React.ElementType;
    disabled?: boolean;
    [key: string]: any;
}

export function Box({ as: Component = "div", className, ...props }: BoxProps) {
    return (
        <Component
            className={cn("box-border min-w-0 bg-bg-primary text-text-primary", className)}
            {...props}
        />
    )
}
