'use client';

import { ReactNode, forwardRef, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '../primitives/Box';
import { Text } from '../primitives/Text';
import { Stack } from '../primitives/Stack';






type InputSize = 'sm' | 'md' | 'lg';
type InputState = 'default' | 'error' | 'success';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    hint?: string;
    error?: string;
    size?: InputSize;
    state?: InputState;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

const inputSizeMap: Record<InputSize, string> = {
    sm: 'h-9 text-sm px-3',
    md: 'h-11 text-base px-4',
    lg: 'h-14 text-lg px-5',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, hint, error, size = 'md', state = 'default', leftIcon, rightIcon, className, id, ...props }, ref) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
        const hasError = state === 'error' || !!error;
        const hasSuccess = state === 'success';

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={inputId} className="block text-caption text-text-secondary mb-2">
                        {label}
                        {props.required && <span className="text-emo-burnout ml-1">*</span>}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            'w-full rounded-xl bg-surface-2 border text-text-primary',
                            'placeholder:text-text-tertiary',
                            'focus:outline-none focus:ring-2 focus:ring-offset-0',
                            'transition-all duration-fast',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            inputSizeMap[size],
                            leftIcon && 'pl-11',
                            rightIcon && 'pr-11',
                            hasError
                                ? 'border-emo-burnout focus:ring-emo-burnout/30'
                                : hasSuccess
                                    ? 'border-emo-happy focus:ring-emo-happy/30'
                                    : 'border-surface-5 focus:border-accent-primary focus:ring-accent-primary/30',
                            className
                        )}
                        aria-invalid={hasError}
                        aria-describedby={hint ? `${inputId}-hint` : undefined}
                        {...props}
                    />

                    {rightIcon && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none">
                            {rightIcon}
                        </div>
                    )}
                </div>

                {(hint || error) && (
                    <p
                        id={`${inputId}-hint`}
                        className={cn(
                            'mt-2 text-micro',
                            hasError ? 'text-emo-burnout' : 'text-text-tertiary'
                        )}
                    >
                        {error || hint}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';






interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    hint?: string;
    error?: string;
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, hint, error, resize = 'vertical', className, id, ...props }, ref) => {
        const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
        const hasError = !!error;

        const resizeMap = {
            none: 'resize-none',
            vertical: 'resize-y',
            horizontal: 'resize-x',
            both: 'resize',
        };

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={textareaId} className="block text-caption text-text-secondary mb-2">
                        {label}
                    </label>
                )}

                <textarea
                    ref={ref}
                    id={textareaId}
                    className={cn(
                        'w-full min-h-[120px] rounded-xl bg-surface-2 border text-text-primary p-4',
                        'placeholder:text-text-tertiary',
                        'focus:outline-none focus:ring-2 focus:ring-offset-0',
                        'transition-all duration-fast',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        resizeMap[resize],
                        hasError
                            ? 'border-emo-burnout focus:ring-emo-burnout/30'
                            : 'border-surface-5 focus:border-accent-primary focus:ring-accent-primary/30',
                        className
                    )}
                    aria-invalid={hasError}
                    {...props}
                />

                {(hint || error) && (
                    <p className={cn('mt-2 text-micro', hasError ? 'text-emo-burnout' : 'text-text-tertiary')}>
                        {error || hint}
                    </p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';






interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, description, className, id, ...props }, ref) => {
        const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <div className={cn('flex items-start gap-3', className)}>
                <div className="relative flex items-center justify-center">
                    <input
                        ref={ref}
                        type="checkbox"
                        id={checkboxId}
                        className={cn(
                            'peer w-5 h-5 rounded-md border-2 border-surface-5 bg-surface-2',
                            'appearance-none cursor-pointer',
                            'checked:bg-accent-primary checked:border-accent-primary',
                            'focus:outline-none focus:ring-2 focus:ring-accent-primary/30',
                            'transition-all duration-fast',
                            'disabled:opacity-50 disabled:cursor-not-allowed'
                        )}
                        {...props}
                    />
                    <svg
                        className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                {(label || description) && (
                    <div className="flex flex-col">
                        {label && (
                            <label htmlFor={checkboxId} className="text-body text-text-primary cursor-pointer">
                                {label}
                            </label>
                        )}
                        {description && (
                            <span className="text-micro text-text-tertiary">{description}</span>
                        )}
                    </div>
                )}
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';






interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    description?: string;
    disabled?: boolean;
    size?: 'sm' | 'md';
}

export function Toggle({
    checked,
    onChange,
    label,
    description,
    disabled = false,
    size = 'md',
}: ToggleProps) {
    const sizeConfig = {
        sm: { track: 'w-9 h-5', thumb: 'w-3.5 h-3.5', translate: 'translate-x-4' },
        md: { track: 'w-12 h-6', thumb: 'w-4.5 h-4.5', translate: 'translate-x-6' },
    };

    const config = sizeConfig[size];

    return (
        <label className={cn('flex items-center gap-3 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed')}>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => !disabled && onChange(!checked)}
                className={cn(
                    'relative inline-flex shrink-0 rounded-full transition-colors duration-medium',
                    config.track,
                    checked ? 'bg-accent-primary' : 'bg-surface-5',
                    'focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:ring-offset-2 focus:ring-offset-bg-primary'
                )}
            >
                <span
                    className={cn(
                        'absolute top-1/2 -translate-y-1/2 left-1 rounded-full bg-white shadow-md transition-transform duration-medium',
                        config.thumb,
                        checked && config.translate
                    )}
                />
            </button>

            {(label || description) && (
                <div className="flex flex-col">
                    {label && <span className="text-body text-text-primary">{label}</span>}
                    {description && <span className="text-micro text-text-tertiary">{description}</span>}
                </div>
            )}
        </label>
    );
}






interface SliderProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    label?: string;
    showValue?: boolean;
    emotional?: boolean;
}

export function Slider({
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    label,
    showValue = true,
    emotional = false,
}: SliderProps) {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className="w-full">
            {(label || showValue) && (
                <div className="flex justify-between items-center mb-3">
                    {label && <Text variant="caption">{label}</Text>}
                    {showValue && <Text variant="micro" className="text-text-tertiary">{value}</Text>}
                </div>
            )}

            <div className="relative h-2">
                {}
                <div
                    className={cn(
                        'absolute inset-0 rounded-full',
                        emotional
                            ? 'bg-gradient-to-r from-emo-drained via-emo-neutral to-emo-energized'
                            : 'bg-surface-5'
                    )}
                />

                {}
                {!emotional && (
                    <div
                        className="absolute inset-y-0 left-0 rounded-full bg-accent-primary"
                        style={{ width: `${percentage}%` }}
                    />
                )}

                {}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className={cn(
                        'absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer',
                        '[&::-webkit-slider-thumb]:appearance-none',
                        '[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5',
                        '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white',
                        '[&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2',
                        '[&::-webkit-slider-thumb]:border-accent-primary',
                        '[&::-webkit-slider-thumb]:cursor-pointer',
                        '[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5',
                        '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white',
                        '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-accent-primary'
                    )}
                />
            </div>
        </div>
    );
}






type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'emotional';

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    size?: 'sm' | 'md';
    dot?: boolean;
}

const badgeVariantMap: Record<BadgeVariant, string> = {
    default: 'bg-surface-3 text-text-secondary border-surface-5',
    success: 'bg-emo-happy-muted text-emo-happy border-emo-happy/20',
    warning: 'bg-emo-energized-muted text-emo-energized border-emo-energized/20',
    error: 'bg-emo-burnout-muted text-emo-burnout border-emo-burnout/20',
    info: 'bg-accent-primary/10 text-accent-primary border-accent-primary/20',
    emotional: 'bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 text-accent-primary border-accent-primary/20',
};

export function Badge({ children, variant = 'default', size = 'sm', dot = false }: BadgeProps) {
    const sizeMap = {
        sm: 'px-2 py-0.5 text-micro',
        md: 'px-3 py-1 text-caption',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full border font-medium',
                sizeMap[size],
                badgeVariantMap[variant]
            )}
        >
            {dot && (
                <span
                    className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        variant === 'success' && 'bg-emo-happy',
                        variant === 'warning' && 'bg-emo-energized',
                        variant === 'error' && 'bg-emo-burnout',
                        variant === 'info' && 'bg-accent-primary',
                        variant === 'default' && 'bg-text-tertiary'
                    )}
                />
            )}
            {children}
        </span>
    );
}






interface AvatarProps {
    src?: string;
    alt?: string;
    name?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    status?: 'online' | 'offline' | 'away';
}

const avatarSizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
};

const statusSizeMap = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
};

export function Avatar({ src, alt, name, size = 'md', status }: AvatarProps) {
    const initials = name
        ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    const statusColors = {
        online: 'bg-emo-happy',
        offline: 'bg-text-tertiary',
        away: 'bg-emo-energized',
    };

    return (
        <div className="relative inline-block">
            {src ? (
                <img
                    src={src}
                    alt={alt || name || 'Avatar'}
                    className={cn(
                        'rounded-full object-cover bg-surface-3',
                        avatarSizeMap[size]
                    )}
                />
            ) : (
                <div
                    className={cn(
                        'rounded-full bg-surface-4 flex items-center justify-center font-bold text-text-secondary',
                        avatarSizeMap[size]
                    )}
                >
                    {initials}
                </div>
            )}

            {status && (
                <span
                    className={cn(
                        'absolute bottom-0 right-0 rounded-full border-2 border-bg-primary',
                        statusSizeMap[size],
                        statusColors[status]
                    )}
                />
            )}
        </div>
    );
}






interface TooltipProps {
    content: string;
    children: ReactNode;
    side?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
}

export function Tooltip({ content, children, side = 'top', delay = 300 }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const showTooltip = () => {
        timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
    };

    const hideTooltip = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsVisible(false);
    };

    const positionMap = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            onFocus={showTooltip}
            onBlur={hideTooltip}
        >
            {children}

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={cn(
                            'absolute z-50 px-3 py-1.5 rounded-lg bg-surface-3 text-text-primary text-micro',
                            'border border-surface-5 shadow-lg whitespace-nowrap',
                            positionMap[side]
                        )}
                        role="tooltip"
                    >
                        {content}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}






type ToastVariant = 'info' | 'success' | 'warning' | 'error';

interface ToastProps {
    variant?: ToastVariant;
    title: string;
    description?: string;
    isVisible: boolean;
    onClose: () => void;
}

const toastIconMap: Record<ToastVariant, ReactNode> = {
    info: <Info className="w-5 h-5 text-accent-primary" />,
    success: <CheckCircle className="w-5 h-5 text-emo-happy" />,
    warning: <AlertTriangle className="w-5 h-5 text-emo-energized" />,
    error: <AlertCircle className="w-5 h-5 text-emo-burnout" />,
};

export function Toast({ variant = 'info', title, description, isVisible, onClose }: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, 5000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className={cn(
                        'fixed bottom-6 right-6 z-[100]',
                        'flex items-start gap-4 p-4 rounded-2xl',
                        'bg-surface-3 border border-surface-5 shadow-2xl',
                        'min-w-[320px] max-w-[400px]'
                    )}
                    role="alert"
                >
                    <div className="shrink-0 mt-0.5">{toastIconMap[variant]}</div>

                    <div className="flex-1">
                        <Text variant="body" className="font-semibold">{title}</Text>
                        {description && (
                            <Text variant="body-sm" className="text-text-secondary mt-1">
                                {description}
                            </Text>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="shrink-0 text-text-tertiary hover:text-text-primary transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}






interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    rounded?: 'sm' | 'md' | 'lg' | 'full';
    className?: string;
}

export function Skeleton({ width, height, rounded = 'md', className }: SkeletonProps) {
    const roundedMap = {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
    };

    return (
        <div
            className={cn(
                'animate-pulse bg-surface-4',
                roundedMap[rounded],
                className
            )}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
            }}
            aria-hidden="true"
        />
    );
}
