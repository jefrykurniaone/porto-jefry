const ID_MONTHS: Record<string, string> = {
    May: 'Mei',
    Aug: 'Agu',
    Oct: 'Okt',
    Dec: 'Des',
};

function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
}

export function translatePeriod(period: string, locale: string): string {
    if (locale !== 'id') return period;

    return Object.entries(ID_MONTHS).reduce((result, [en, id]) => {
        const escaped = escapeRegex(en);
        // Use word boundaries to avoid partial replacements (e.g., "Maybe" -> not "Meibe")
        const regex = new RegExp(`\\b${escaped}\\b`, 'g');
        return result.replace(regex, id);
    }, period);
}
