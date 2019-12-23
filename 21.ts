import { AsciiIO, IntcodeProcessor } from "./intcode";

const registers = "ABCD".split("");

export function solve(lines: string[]) {
    const program = lines[0].split(",").map(s => +s);
    const droid = new SpringDroid(program);
    droid.run();
    const test = generateTest([true, true, true, true]);
    return droid.runSpring([
        ...test,
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

function generateTest(config: boolean[]) {
    const instructions: string[] = [];
    if (config[0]) {
        instructions.push(`OR A J`);
    } else {
        instructions.push(`NOT A J`);
    }
    for (let i = 1; i < config.length; i++) {
        if (config[i]) {
            instructions.push(`OR ${registers[i]} J`);
        } else {
            instructions.push(`NOT ${registers[i]} T`);
            instructions.push("AND T J");
        }
    }
    return instructions;
}