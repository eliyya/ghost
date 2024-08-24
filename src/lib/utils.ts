export function parseName(name: string, trim = true) {
    const n = trim ? name.trim() : name
    return n
        .replace(/ +/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
}
