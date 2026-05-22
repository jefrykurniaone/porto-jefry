const ID_MONTHS: Record<string, string> = {
    May: 'Mei',
    Aug: 'Agu',
    Oct: 'Okt',
    Dec: 'Des',
};

export function translatePeriod(period: string, locale: string): string {
    if (locale !== 'id') return period;

    return Object.entries(ID_MONTHS).reduce(
        (result, [en, id]) => result.replace(new RegExp(en, 'g'), id),
        period
    );
}
