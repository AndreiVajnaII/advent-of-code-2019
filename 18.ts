import { isLowerCase, isUpperCase } from "./utils";

export function solve(lines: string[]) {
    lines = [
        "#################",
        "#i.G..c...e..H.p#",
        "########.########",
        "#j.A..b...f..D.o#",
        "########@########",
        "#k.E..a...g..B.n#",
        "########.########",
        "#l.F..d...h..C.m#",
        "#################",
    ];
    const maze = new Maze(lines);
    maze.print();
}

class Maze {
    private width: number;
    private height: number;
    private startRow: number;
    private startCol: number;
    private graph = new Map<string, Map<string, EdgeData>>();

    constructor(private map: string[]) {
        this.height = map.length;
        this.width = map[0].length;
        this.startRow = map.findIndex(row => row.includes("@"));
        this.startCol = map[this.startRow].indexOf("@");
        this.buildGraph();
    }

    public print() {
        for (const [start, edge] of this.graph) {
            for (const [end, data] of edge) {
                console.log(start, end, data.distance, data.keys.join(""));
            }
        }
    }

    private buildGraph() {
        const visitData = new Array<VisitData[]>(this.height);
        for (let row = 0; row < this.height; row++) {
            visitData[row] = new Array<VisitData>(this.width);
        }
        visitData[this.startRow][this.startCol] = new VisitData(0, "@", 0, []);
        let toVisit: Array<[number, number, VisitData]> = [];
        this.findNextToVisit(this.startRow, this.startCol, visitData, toVisit, new VisitData(1, "@", 0, []));
        while (toVisit.length > 0) {
            const nextToVisit: Array<[number, number, VisitData]> = [];
            for (const [row, col, prevData] of toVisit) {
                visitData[row][col] = prevData;
                const nextData: VisitData = prevData.next();
                if (isLowerCase(this.map[row][col])) {
                    this.addEdge(this.map[row][col], prevData.lastKey,
                        prevData.steps - prevData.lastSteps, prevData.neededKeys);
                    nextData.lastKey = this.map[row][col];
                    nextData.lastSteps = prevData.steps;
                    nextData.neededKeys = [];
                }
                if (isUpperCase(this.map[row][col])) {
                    nextData.neededKeys.push(this.map[row][col].toLowerCase());
                }
                this.findNextToVisit(row, col, visitData, nextToVisit, nextData);
            }
            toVisit = nextToVisit;
        }
    }

    private findNextToVisit(
        row: number, col: number, visitData: VisitData[][],
        toVisit: Array<[number, number, VisitData]>, nextData: VisitData) {
        [[1, 0], [-1, 0], [0, 1], [0, -1]]
            .map(([dr, dc]) => [row + dr, col + dc])
            .filter(([newRow, newCol]) => this.map[newRow][newCol] !== "#"
                && visitData[newRow][newCol] === undefined)
            .forEach(([newRow, newCol]) => {
                toVisit.push([newRow, newCol, nextData]);
            });
    }

    private addEdge(a: string, b: string, distance: number, neededKeys: string[]) {
        this.addUniEdge(a, b, distance, neededKeys);
        this.addUniEdge(b, a, distance, neededKeys);
    }

    private addUniEdge(a: string, b: string, distance: number, neededKeys: string[]) {
        if (!this.graph.has(a)) {
            this.graph.set(a, new Map());
        }
        this.graph.get(a)!.set(b, new EdgeData(distance, neededKeys));
    }

}

class EdgeData {
    constructor(
        public distance: number,
        public keys: string[]) { }
}

class VisitData {
    constructor(
        public steps: number,
        public lastKey: string,
        public lastSteps: number,
        public neededKeys: string[]) { }

    public next() {
        return new VisitData(this.steps + 1, this.lastKey, this.lastSteps, [...this.neededKeys]);
    }
}
