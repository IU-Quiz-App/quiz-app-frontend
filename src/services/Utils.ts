export function resolveNestedValue(obj: any, path: string) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export function formatDate(dateString: string|undefined): string {
    if (!dateString) {
        return '';
    }

    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };
    return date.toLocaleString('de-DE', options);
}

export async function delay(s: number) {
    await new Promise(resolve => setTimeout(resolve, s*1000));
}
