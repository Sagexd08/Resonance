
export const formatDate = (date: Date, locale = 'en-US'): string => {
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};

export const clamp = (num: number, min: number, max: number): number => {
    return Math.min(Math.max(num, min), max);
};
