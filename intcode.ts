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
        return f;
    }

    public executeOp(f: (a: number, b: number) => number) {
        return (program: number[], position: number) => f(
            this.getValue(0)(program, position + 1),
            this.getValue(1)(program, position + 2));
    }

}

export interface IO {
    read(): number | undefined;
    write(v: number): void;
}

export class IntcodeProcessor {

    public halted = false;

    private position = 0;

    constructor(private program: number[], private io: IO) { }

    public execute() {
        while (this.program[this.position] !== 99) {
            const opcode = new Opcode(this.program[this.position]);
            if (opcode.opcode === 1) {
                this.program[this.program[this.position + 3]] = this.executeOp(opcode, (a, b) => a + b);
                this.position += 4;
            } else if (opcode.opcode === 2) {
                this.program[this.program[this.position + 3]] = this.executeOp(opcode, (a, b) => a * b);
                this.position += 4;
            } else if (opcode.opcode === 3) {
                const v = this.io.read();
                if (v === undefined) {
                    return;
                }
                this.program[this.program[this.position + 1]] = v;
                this.position += 2;
            } else if (opcode.opcode === 4) {
                this.io.write(this.program[this.program[this.position + 1]]);
                this.position += 2;
            } else if (opcode.opcode === 5) {
                this.position = this.executeOp(opcode, (a, b) => a !== 0 ? b : this.position + 3);
            } else if (opcode.opcode === 6) {
                this.position = this.executeOp(opcode, (a, b) => a === 0 ? b : this.position + 3);
            } else if (opcode.opcode === 7) {
                this.program[this.program[this.position + 3]] = this.executeOp(opcode, (a, b) => a < b ? 1 : 0);
                this.position += 4;
            } else if (opcode.opcode === 8) {
                this.program[this.program[this.position + 3]] = this.executeOp(opcode, (a, b) => a === b ? 1 : 0);
                this.position += 4;
            } else {
                throw new Error(`Wrong opcode at ${this.position}: ${this.program[this.position]}`);
            }
        }
        this.halted = true;
    }

    private executeOp(opcode: Opcode, f: (a: number, b: number) => number) {
        return opcode.executeOp(f)(this.program, this.position);
    }
}
