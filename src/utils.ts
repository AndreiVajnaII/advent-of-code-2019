export type ValuesOf<T extends readonly any[]> = T extends ReadonlyArray<infer R> ? R : never;

export const toNum = (s: string) => +s;

export const sum = (a: number, b: number) => a + b;
export const product = (a: number, b: number) => a * b;
export const max = (a: number, b: number) => a > b ? a : b;
export const min = (a: number, b: number) => a < b ? a : b;
export const ascending = (a: number, b: number) => a - b;

export const withOriginal = <T, R>(f: (x: T, index: number) => R) =>
    (x: T, index: number) => [x, f(x, index)] as const;
export const mapped = <T>([_o, m]: readonly [any, T]) => m;
export const original = <T>([o, _m]: readonly [T, any]) => o;
export const byOriginal = <T, R>(f: (x: T) => R) =>
    ([o, _m]: readonly [T, any]) => f(o);
export const ofOriginal = <T, M, R>(f: (x: T) => R) =>
    ([o, m]: readonly [T, M]) => [f(o), m] as const;

export const minOf = <T>(f: (x: T) => number) => (a: T, b: T) => f(a) < f(b) ? a : b;
export const maxOf = <T>(f: (x: T) => number) => (a: T, b: T) => f(a) > f(b) ? a : b;

export const concat = <T>(a: T[], b: T[]) => a.concat(b);

export function lcm(a: number, b: number) {
    return a * b / gcd(a, b);
}

export function gcd(a: number, b: number): number {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

export const manhattan = ({ x, y }: { x: number; y: number }) => Math.abs(x) + Math.abs(y);

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

export class Box<T> {
    constructor(public value: T) { }

    public map<R>(f: (value: T) => R) {
        return new Box(f(this.value));
    }

    public reduce<R>(f: (value: T) => R) {
        return f(this.value);
    }
}

export const boxed = <T>(value: T) => new Box(value);

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
