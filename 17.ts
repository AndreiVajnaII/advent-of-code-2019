import { InMemoryIO, IntcodeProcessor } from "./intcode";

export function solve(lines: string[]) {
    const program = lines[0].split(",").map(s => +s);
    const io = new InMemoryIO();
    const proc = new IntcodeProcessor(program, io);
    proc.run();
    let row = 0;
    const map: string[] = [];
    map[row] = "";
    while (io.output.length > 0) {
        const c = String.fromCharCode(io.output.shift()!);
        if (c === "\n") {
            row++;
            map[row] = "";
        } else {
            map[row] += c;
        }
    }
    const intersections: number[] = [];
    for (let y = 1; y < map.length - 1; y++) {
        for (let x = 1; x < map[0].length - 1; x++) {
            if (isIntersection(x, y, map)) {
                intersections.push(x * y);
            }
        }
    }

    return intersections.reduce((r, x) => r + x);
}

function isIntersection(x: number, y: number, map: string[]) {
    return map[y][x] === "#"
        && map[y - 1][x] === "#"
        && map[y][x - 1] === "#"
        && map[y + 1][x] === "#"
        && map[y][x + 1] === "#";
}
