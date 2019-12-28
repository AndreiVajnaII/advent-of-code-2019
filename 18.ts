import { isLowerCase, isUpperCase } from "./utils";

export function solve(lines: string[]) {
    // lines = [
    //     "########################",
    //     "#f.D.E.e.C.b.A.@.a.B.c.#",
    //     "######################.#",
    //     "#d.....................#",
    //     "########################",
    // ];
    const maze = new Maze(lines);
    maze.print();
}

class Maze {
    private width: number;
    private height: number;
    private startRow: number;
    private startCol: number;
    private keys: Key[] = [];
    private paths = new Map<string, Map<string, Path>>();

    constructor(private map: string[]) {
        this.height = map.length;
        this.width = map[0].length;
        this.startRow = map.findIndex(row => row.includes("@"));
        this.startCol = map[this.startRow].indexOf("@");
        this.findKeys();
        this.findPaths();
    }

    public print() {
        for (const [start, paths] of this.paths) {
            for (const [end, p] of paths) {
                console.log(start, end, p.steps, p.keysNeeded.join(""));
            }
        }
    }

    private findKeys() {
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                if (isLowerCase(this.map[row][col])) {
                    this.keys.push(new Key(this.map[row][col], row, col));
                }
            }
        }
    }

    private findPaths() {
        for (const start of [{ name: "@", row: this.startRow, col: this.startCol }, ...this.keys]) {
            const paths = new Map<string, Path>();
            this.paths.set(start.name, paths);
            for (const end of this.keys) {
                if (start !== end) {
                    paths.set(end.name, this.findPath(start, end));
                }
            }
        }
    }

    private findPath({ row, col }: Point, endKey: Key, path: Array<[number, number]> = [], keys: string[] = []): Path {
        if (this.map[row][col] === endKey.name) {
            return new Path(path.length, keys);
        } else {
            return [[1, 0], [-1, 0], [0, 1], [0, -1]]
                .map(([dr, dc]) => [row + dr, col + dc])
                .filter(([newRow, newCol]) => newRow >= 0 && newRow < this.height && newCol >= 0 && newCol < this.width)
                .filter(([newRow, newCol]) => !path.some(([r, c]) => r === newRow && c === newCol))
                .filter(([newRow, newCol]) => this.map[newRow][newCol] !== "#")
                .map(([newRow, newCol]) => {
                    const newKeys = [...keys];
                    if (isUpperCase(this.map[newRow][newCol])) {
                        newKeys.push(this.map[newRow][newCol]);
                    }
                    return this.findPath({ row: newRow, col: newCol }, endKey, [...path, [row, col]], newKeys);
                }).reduce((min, p) => p.steps < min.steps ? p : min, new Path(Infinity, []));
        }
    }
}

class Point {
    constructor(public row: number, public col: number) { }
}

class Key {
    constructor(
        public name: string,
        public row: number,
        public col: number) { }
}

class Path {
    constructor(
        public steps: number,
        public keysNeeded: string[]) { }
}
