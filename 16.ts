export function solve(lines: string[]) {
    let input = lines[0].split("").map(s => +s);
    for (let i = 0; i < 100; i++) {
        input = phase(input);
    }
    return input.slice(0, 8).join("");
}

function phase(input: number[]) {
    return input.map(calcOutput);
}

function calcOutput(x: number, index: number, input: number[]) {
    let v = 0;
    for (let i = index; i < input.length;) {
        for (let j = 0; j < index + 1 && i < input.length; j++, i++) {
            v += input[i];
        }
        i += index + 1;
        for (let j = 0; j < index + 1 && i < input.length; j++, i++) {
            v -= input[i];
        }
        i += index + 1;
    }
    return Math.abs(v) % 10;
}
