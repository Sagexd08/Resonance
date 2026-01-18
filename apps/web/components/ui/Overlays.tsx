'use client';

import { ReactNode, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Check, Command } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '../primitives/Box';
import { Text } from '../primitives/Text';
import { Stack } from '../primitives/Stack';
import { GlassSurface } from '../primitives/GlassSurface';
import { Button } from './Button';
import { fadeIn, transitionMedium } from '../../lib/motion/transitions';






interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    closeOnOverlay?: boolean;
    closeOnEsc?: boolean;
    children: ReactNode;
}

const modalSizeMap = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw] max-h-[90vh]',
};

export function Modal({
    isOpen,
    onClose,
    title,
    description,
    size = 'md',
    closeOnOverlay = true,
    closeOnEsc = true,
    children,
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    
    useEffect(() => {
        if (!closeOnEsc || !isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, closeOnEsc, onClose]);

    
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    
    useEffect(() => {
        if (!isOpen || !modalRef.current) return;

        const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        firstElement?.focus();

        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        document.addEventListener('keydown', handleTab);
        return () => document.removeEventListener('keydown', handleTab);
    }, [isOpen]);

    if (typeof window === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        onClick={closeOnOverlay ? onClose : undefined}
                        aria-hidden="true"
                    />

                    {}
                    <motion.div
                        ref={modalRef}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className={cn(
                            'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101]',
                            'w-full p-6',
                            modalSizeMap[size]
                        )}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={title ? 'modal-title' : undefined}
                        aria-describedby={description ? 'modal-description' : undefined}
                    >
                        <GlassSurface intensity="heavy" className="p-8 relative">
                            {}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-surface-3 transition-all"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {}
                            {(title || description) && (
                                <div className="mb-6 pr-8">
                                    {title && (
                                        <Text id="modal-title" variant="h3" className="mb-2">
                                            {title}
                                        </Text>
                                    )}
                                    {description && (
                                        <Text id="modal-description" variant="body" className="text-text-secondary">
                                            {description}
                                        </Text>
                                    )}
                                </div>
                            )}

                            {}
                            {children}
                        </GlassSurface>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}






interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    side?: 'left' | 'right';
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
}

const drawerSizeMap = {
    sm: 'w-80',
    md: 'w-96',
    lg: 'w-[480px]',
};

export function Drawer({
    isOpen,
    onClose,
    title,
    side = 'right',
    size = 'md',
    children,
}: DrawerProps) {
    
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (typeof window === 'undefined') return null;

    const slideFrom = side === 'right' ? { x: '100%' } : { x: '-100%' };
    const slideTo = { x: 0 };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                        onClick={onClose}
                    />

                    {}
                    <motion.div
                        initial={slideFrom}
                        animate={slideTo}
                        exit={slideFrom}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className={cn(
                            'fixed top-0 h-full z-[101]',
                            'bg-bg-secondary border-surface-5',
                            side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
                            drawerSizeMap[size]
                        )}
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="h-full flex flex-col">
                            {}
                            <div className="flex items-center justify-between p-6 border-b border-surface-5">
                                {title && <Text variant="h4">{title}</Text>}
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-surface-3 transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {}
                            <div className="flex-1 overflow-y-auto p-6">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}






interface PopoverProps {
    trigger: ReactNode;
    children: ReactNode;
    side?: 'top' | 'bottom' | 'left' | 'right';
    align?: 'start' | 'center' | 'end';
}

export function Popover({ trigger, children, side = 'bottom', align = 'center' }: PopoverProps) {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (
                triggerRef.current?.contains(e.target as Node) ||
                contentRef.current?.contains(e.target as Node)
            ) {
                return;
            }
            setIsOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const positionClasses = {
        top: 'bottom-full mb-2',
        bottom: 'top-full mt-2',
        left: 'right-full mr-2',
        right: 'left-full ml-2',
    };

    const alignClasses = {
        start: side === 'top' || side === 'bottom' ? 'left-0' : 'top-0',
        center: side === 'top' || side === 'bottom' ? 'left-1/2 -translate-x-1/2' : 'top-1/2 -translate-y-1/2',
        end: side === 'top' || side === 'bottom' ? 'right-0' : 'bottom-0',
    };

    return (
        <div className="relative inline-block">
            <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
                {trigger}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={contentRef}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                            'absolute z-50',
                            positionClasses[side],
                            alignClasses[align]
                        )}
                    >
                        <GlassSurface intensity="heavy" className="p-4 min-w-[200px]">
                            {children}
                        </GlassSurface>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}






interface SelectOption {
    value: string;
    label: string;
    icon?: ReactNode;
}

interface SelectProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
}

export function Select({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    label,
    disabled = false,
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(o => o.value === value);

    
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (!containerRef.current?.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div ref={containerRef} className="relative w-full">
            {label && (
                <Text variant="caption" className="block mb-2 text-text-secondary">
                    {label}
                </Text>
            )}

            <button
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={cn(
                    'w-full h-11 px-4 rounded-xl bg-surface-2 border border-surface-5',
                    'flex items-center justify-between gap-3',
                    'text-left transition-all duration-fast',
                    'focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30',
                    disabled && 'opacity-50 cursor-not-allowed',
                    isOpen && 'border-accent-primary'
                )}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className={cn(selectedOption ? 'text-text-primary' : 'text-text-tertiary')}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    className={cn(
                        'w-4 h-4 text-text-tertiary transition-transform',
                        isOpen && 'rotate-180'
                    )}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 mt-2 z-50"
                    >
                        <GlassSurface intensity="heavy" className="p-2 max-h-60 overflow-y-auto">
                            <ul role="listbox">
                                {options.map((option) => (
                                    <li key={option.value}>
                                        <button
                                            onClick={() => {
                                                onChange(option.value);
                                                setIsOpen(false);
                                            }}
                                            className={cn(
                                                'w-full px-3 py-2.5 rounded-lg flex items-center gap-3',
                                                'text-left transition-colors',
                                                value === option.value
                                                    ? 'bg-accent-primary/10 text-accent-primary'
                                                    : 'text-text-secondary hover:bg-surface-3 hover:text-text-primary'
                                            )}
                                            role="option"
                                            aria-selected={value === option.value}
                                        >
                                            {option.icon && <span className="shrink-0">{option.icon}</span>}
                                            <span className="flex-1">{option.label}</span>
                                            {value === option.value && (
                                                <Check className="w-4 h-4 shrink-0" />
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </GlassSurface>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}






interface Tab {
    id: string;
    label: string;
    icon?: ReactNode;
    content: ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    defaultTab?: string;
    onChange?: (tabId: string) => void;
}

export function Tabs({ tabs, defaultTab, onChange }: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        onChange?.(tabId);
    };

    const activeContent = tabs.find(t => t.id === activeTab)?.content;

    return (
        <div className="w-full">
            {}
            <div
                role="tablist"
                className="flex gap-1 p-1 rounded-xl bg-surface-2 border border-surface-5 mb-6"
            >
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`panel-${tab.id}`}
                        onClick={() => handleTabChange(tab.id)}
                        className={cn(
                            'flex-1 px-4 py-2.5 rounded-lg flex items-center justify-center gap-2',
                            'text-body-sm font-medium transition-all duration-fast',
                            activeTab === tab.id
                                ? 'bg-surface-4 text-text-primary shadow-sm'
                                : 'text-text-tertiary hover:text-text-secondary'
                        )}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    role="tabpanel"
                    id={`panel-${activeTab}`}
                >
                    {activeContent}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}






interface AccordionItem {
    id: string;
    title: string;
    content: ReactNode;
}

interface AccordionProps {
    items: AccordionItem[];
    allowMultiple?: boolean;
}

export function Accordion({ items, allowMultiple = false }: AccordionProps) {
    const [openItems, setOpenItems] = useState<string[]>([]);

    const toggleItem = (id: string) => {
        if (allowMultiple) {
            setOpenItems(prev =>
                prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
            );
        } else {
            setOpenItems(prev => (prev.includes(id) ? [] : [id]));
        }
    };

    return (
        <div className="space-y-2">
            {items.map((item) => {
                const isOpen = openItems.includes(item.id);

                return (
                    <div
                        key={item.id}
                        className="rounded-xl bg-surface-2 border border-surface-5 overflow-hidden"
                    >
                        <button
                            onClick={() => toggleItem(item.id)}
                            className="w-full px-5 py-4 flex items-center justify-between text-left"
                            aria-expanded={isOpen}
                            aria-controls={`accordion-${item.id}`}
                        >
                            <Text variant="body" className="font-medium">
                                {item.title}
                            </Text>
                            <ChevronDown
                                className={cn(
                                    'w-5 h-5 text-text-tertiary transition-transform duration-medium',
                                    isOpen && 'rotate-180'
                                )}
                            />
                        </button>

                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    id={`accordion-${item.id}`}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-5 pb-5 text-text-secondary">
                                        {item.content}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}






interface CommandItem {
    id: string;
    label: string;
    shortcut?: string;
    icon?: ReactNode;
    action: () => void;
    group?: string;
}

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    commands: CommandItem[];
    placeholder?: string;
}

export function CommandPalette({
    isOpen,
    onClose,
    commands,
    placeholder = 'Type a command or search...',
}: CommandPaletteProps) {
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredCommands = commands.filter(cmd =>
        cmd.label.toLowerCase().includes(search.toLowerCase())
    );

    
    const groupedCommands = filteredCommands.reduce((acc, cmd) => {
        const group = cmd.group || 'Actions';
        if (!acc[group]) acc[group] = [];
        acc[group].push(cmd);
        return acc;
    }, {} as Record<string, CommandItem[]>);

    
    const flatList = Object.values(groupedCommands).flat();

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setSearch('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => Math.min(prev + 1, flatList.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (flatList[selectedIndex]) {
                    flatList[selectedIndex].action();
                    onClose();
                }
                break;
            case 'Escape':
                onClose();
                break;
        }
    };

    if (typeof window === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="fixed left-1/2 top-[20%] -translate-x-1/2 z-[101] w-full max-w-xl"
                        onKeyDown={handleKeyDown}
                    >
                        <GlassSurface intensity="heavy" className="overflow-hidden">
                            {}
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-5">
                                <Command className="w-5 h-5 text-text-tertiary shrink-0" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setSelectedIndex(0);
                                    }}
                                    placeholder={placeholder}
                                    className="flex-1 bg-transparent text-text-primary placeholder:text-text-tertiary focus:outline-none"
                                />
                                <kbd className="px-2 py-1 rounded bg-surface-3 text-text-tertiary text-micro">
                                    ESC
                                </kbd>
                            </div>

                            {}
                            <div className="max-h-80 overflow-y-auto p-2">
                                {Object.entries(groupedCommands).map(([group, items]) => (
                                    <div key={group} className="mb-3">
                                        <Text variant="micro" className="px-3 py-2 text-text-tertiary uppercase tracking-wider">
                                            {group}
                                        </Text>
                                        {items.map((cmd, idx) => {
                                            const globalIdx = flatList.indexOf(cmd);
                                            const isSelected = globalIdx === selectedIndex;

                                            return (
                                                <button
                                                    key={cmd.id}
                                                    onClick={() => {
                                                        cmd.action();
                                                        onClose();
                                                    }}
                                                    onMouseEnter={() => setSelectedIndex(globalIdx)}
                                                    className={cn(
                                                        'w-full px-3 py-2.5 rounded-lg flex items-center gap-3',
                                                        'text-left transition-colors',
                                                        isSelected
                                                            ? 'bg-accent-primary/10 text-accent-primary'
                                                            : 'text-text-secondary hover:bg-surface-3'
                                                    )}
                                                >
                                                    {cmd.icon && (
                                                        <span className="shrink-0 text-text-tertiary">
                                                            {cmd.icon}
                                                        </span>
                                                    )}
                                                    <span className="flex-1">{cmd.label}</span>
                                                    {cmd.shortcut && (
                                                        <kbd className="px-2 py-0.5 rounded bg-surface-3 text-text-tertiary text-micro">
                                                            {cmd.shortcut}
                                                        </kbd>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))}

                                {flatList.length === 0 && (
                                    <div className="py-8 text-center text-text-tertiary">
                                        No commands found
                                    </div>
                                )}
                            </div>
                        </GlassSurface>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
