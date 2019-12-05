class Opcode {
    public opcode: number;
    public modes: [boolean, boolean, boolean];

    constructor(code: number) {
        this.opcode = code % 100;
        this.modes = [
            (code % 1000) / 100 >= 1,
            (code % 10000) / 1000 >= 1,
            code / 10000 >= 1,
        ];
    }

    public getValue(index: number) {
        return (program: number[], position: number) => {
            return this.modes[index]
                ? program[position]
                : program[program[position]];
        };
    }

    public binaryOp(f: (a: number, b: number) => number) {
        return f
    }

    public executeOp(f: (a: number, b: number) => number) {
        return (program: number[], position: number) => f(
            this.getValue(0)(program, position + 1),
            this.getValue(1)(program, position + 2));
    }

}

function execute(program: number[]) {
    let position = 0;
    const opExecutor = (opcode: Opcode, f: (a: number, b: number) => number) => opcode.executeOp(f)(program, position);
    while (program[position] !== 99) {
        const opcode = new Opcode(program[position]);
        if (opcode.opcode === 1) {
            program[program[position + 3]] = opExecutor(opcode, (a, b) => a + b);
            position += 4;
        } else if (opcode.opcode === 2) {
            program[program[position + 3]] = opExecutor(opcode, (a, b) => a * b);
            position += 4;
        } else if (opcode.opcode === 3) {
            const v = input.pop();
            if (v === undefined) {
                throw new Error("Unexpected input");
            }
            program[program[position + 1]] = v;
            position += 2;
        } else if (opcode.opcode === 4) {
            console.log(program[program[position + 1]]);
            position += 2;
        } else if (opcode.opcode === 5) {
            position = opExecutor(opcode, (a, b) => a !== 0 ? b : position + 3);
        } else if (opcode.opcode === 6) {
            position = opExecutor(opcode, (a, b) => a === 0 ? b : position + 3);
        } else if (opcode.opcode === 7) {
            program[program[position + 3]] = opExecutor(opcode, (a, b) => a < b ? 1 : 0);
            position += 4;
        } else if (opcode.opcode === 8) {
            program[program[position + 3]] = opExecutor(opcode, (a, b) => a === b ? 1 : 0);
            position += 4;
        } else {
            throw new Error(`Wrong opcode at ${position}: ${program[position]}`);
        }
    }
}

export function solve(lines: string[]) {
    const program = lines[0].split(",").map(s => +s);
    execute(program);
}

const input = [5];
