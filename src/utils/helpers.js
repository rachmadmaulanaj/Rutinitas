export function durationFormat(duration) {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    let result = '';
    if (hours > 0 && minutes > 0) result = `${hours}j ${minutes}m`;
    else if (hours > 0) result = `${hours}j`;
    else result = `${minutes}m`;

    return result;
}

export function convertColorHexaCategory(color) {
    switch (color) {
        case 'yellow-500':
            return '#eab308'; //#fde047
        case 'green-500':
            return '#22c55e'; //86efac
        case 'purple-500':
            return '#a855f7'; //d8b4fe
        case 'blue-500':
            return '#3b82f6'; //93c5fd
        case 'red-500':
            return '#ef4444'; //fca5a5
        case 'orange-500':
            return '#f97316'; //fdba74
        case 'gray-500':
            return '#6b7280'; //d1d5db
        default:
            return '#ff0000';
    }
}