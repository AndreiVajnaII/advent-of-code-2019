import { execute } from "./intcode";

export function solve(lines: string[]) {
    const program = lines[0].split(",").map(s => +s);
    const input = [5];
    const read = () => input.pop();
    const write = (v: number) => console.log(v);
    execute(program, { read, write });
}
