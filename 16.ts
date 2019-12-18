export function solve(lines: string[]) {
    // lines = ["12345678"];
    const input = lines[0].split("").map(s => +s);
    return [0, 1, 2, 3, 4, 5, 6, 7].map(i => calc(i, 100, input)).join("");
}

const cache: number[][] = [];

function calc(index: number, phase: number, input: number[]): number {
    if (cache[phase] && cache[phase][index] !== undefined) {
        return cache[phase][index];
    }
    let v = 0;
    for (let i = index; i < input.length; i += index + 1) {
        for (let j = 0; j < index + 1 && i < input.length; j++ , i++) {
            v += phase > 1 ? calc(i, phase - 1, input) : input[i];
        }
        i += index + 1;
        for (let j = 0; j < index + 1 && i < input.length; j++ , i++) {
            v -= phase > 1 ? calc(i, phase - 1, input) : input[i];
        }
    }
    v = Math.abs(v) % 10;
    addToCache(phase, index, v);
    return v;
}

function addToCache(phase: number, index: number, v: number) {
    if (!cache[phase]) {
        cache[phase] = [];
    }
    cache[phase][index] = v;
}


function calcOutput(x: number, index: number, input: number[]) {
    let v = 0;
    for (let i = index; i < input.length;) {
        for (let j = 0; j < index + 1 && i < input.length; j++ , i++) {
            v += input[i];
        }
        i += index + 1;
        for (let j = 0; j < index + 1 && i < input.length; j++ , i++) {
            v -= input[i];
        }
        i += index + 1;
    }
    return Math.abs(v) % 10;
}
