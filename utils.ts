export type ValuesOf<T extends readonly any[]> = T extends ReadonlyArray<infer R> ? R : never;
