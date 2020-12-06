export type ValuesOf<T extends readonly any[]> = T extends ReadonlyArray<infer R> ? R : never;

export const sum = (a: number, b: number) => a + b;

export function isUpperCase(s: string) {
    return s.charCodeAt(0) >= "A".charCodeAt(0) && s.charCodeAt(0) <= "Z".charCodeAt(0);
}

export function isLowerCase(s: string) {
    return s.charCodeAt(0) >= "a".charCodeAt(0) && s.charCodeAt(0) <= "z".charCodeAt(0);
}

export function objFromEntries<K extends keyof any, V>(entries: Iterable<readonly [K, V]>) {
    const result: Partial<Record<K, V>> = {};
    for (const [key, value] of entries) {
        result[key] = value;
    }
    return result;
}

export type CollectFunction<T> = (a: Set<T>, b: Set<T>) => Set<T>;

export function union<T>(a: Set<T>, b: Set<T>) {
    const result = new Set<T>();
    a.forEach(x => {
        result.add(x);
    });
    b.forEach(x => {
        result.add(x);
    });
    return result;
}

export function intersect<T>(a: Set<T>, b: Set<T>) {
    const result = new Set<T>();
    a.forEach(x => {
        if (b.has(x)) {
            result.add(x);
        }
    });
    return result;
}

// groups lines separated by blank lines
export function groupLines(lines: string[]) {
    const result: string[][] = [];
    let newGroup = true;
    for (const line of lines) {
        if (line === "") {
            newGroup = true;
        } else {
            if (newGroup) {
                result.push([line]);
                newGroup = false;
            } else {
                result[result.length - 1].push(line);
            }
        }
    }
    return result;
}
