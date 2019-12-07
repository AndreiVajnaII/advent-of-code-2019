import { execute, IO } from "./intcode";

type PhaseSetting = [number, number, number, number, number];

class AmpIO implements IO {

    public output: number[] = [];

    constructor(public input: number[]) { }

    public read() {
        return this.input.shift();
    }

    public write(v: number) {
        this.output.push(v);
    }
}

class Amplifier {
    constructor(private program: number[], public io: AmpIO) {}

    public run(prevOutput: number) {
        this.io.input.push(prevOutput);
        execute(this.program, this.io);
        return this.io.output[0];
    }
}

function runAmps(program: number[], phase: PhaseSetting) {
    let lastOutput = 0;
    for (let i = 0; i < 5; i++) {
        lastOutput = new Amplifier([...program], new AmpIO([phase[i]])).run(lastOutput);
    }
    return lastOutput;
}

function generatePhases(available: number[], phase: number[] = []): PhaseSetting[] {
    if (available.length === 0) {
        return [phase as PhaseSetting];
    } else {
        return available
            .map((x, i) => generatePhases(
                [...available.slice(0, i), ...available.slice(i + 1)],
                [...phase, x]))
            .reduce((acc, x) => acc.concat(x), []);
    }
}

export function solve(lines: string[]) {
    const program = lines[0].split(",").map(s => +s);
    return generatePhases([0, 1, 2, 3, 4])
        .map(phase => runAmps(program, phase))
        .reduce((max, x) => x > max ? x : max);
}
