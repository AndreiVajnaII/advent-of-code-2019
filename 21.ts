import { AsciiIO, IntcodeProcessor } from "./intcode";

export function solve(lines: string[]) {
    const program = lines[0].split(",").map(s => +s);
    const droid = new SpringDroid(program);
    droid.run();
    return droid.runSpring([
        "OR B T",
        "AND C T",
        "NOT T J",
        "NOT A T",
        "OR T J",
        "AND D J",
        "WALK",
    ]);
}

class SpringDroid {
    private io: AsciiIO;
    private droid: IntcodeProcessor;

    constructor(program: number[]) {
        this.io = new AsciiIO();
        this.droid = new IntcodeProcessor(program, this.io);
    }

    public run() {
        this.droid.run();
        console.log(this.io.readString());
    }

    public runSpring(instructions: string[]) {
        this.io.writeInstruction(instructions.join("\n"));
        this.run();
        return this.io.shift();
    }
}
