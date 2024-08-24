export function parseName(name: string) {
    return name
        .trim()
        .replace(/ +/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
}
