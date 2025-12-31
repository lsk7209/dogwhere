function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9가-힣\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
}

console.log('Result 1:', generateSlug('올리브영 군자역'));
console.log('Result 2:', generateSlug('BCBG 강남점'));
console.log('Result 3:', generateSlug('멍멍이!'));
