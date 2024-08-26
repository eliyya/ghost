export function parseName(name: string, trim = true) {
    const n = trim ? name.trim() : name
    return n.replace(/ +/g, ' ').toLowerCase()
}
