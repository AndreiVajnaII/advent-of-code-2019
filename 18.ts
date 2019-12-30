import { isLowerCase, isUpperCase } from "./utils";

export function solve(lines: string[]) {
    // lines = [
    //     "########################",
    //     "#@..............ac.GI.b#",
    //     "###d#e#f################",
    //     "###A#B#C################",
    //     "###g#h#i################",
    //     "########################",
    // ];
    // lines = [
    //     "########################",
    //     "#f.D.E.e.C.b.A.@.a.B.c.#",
    //     "######################.#",
    //     "#d.....................#",
    //     "########################",
    // ];
    const maze = new Maze(lines);
    return maze.solve();
}

class Maze {
    private width: number;
    private height: number;
    private keys: string[];
    private graph = new Map<string, Map<string, EdgeData>>();

    constructor(private map: string[]) {
        this.height = map.length;
        this.width = map[0].length;
        this.keys = this.map.join("").split("").filter(isLowerCase);
        this.findPaths("@");
        this.keys.forEach(key => this.findPaths(key));
    }

    public print() {
        for (const [start, edge] of this.graph) {
            for (const [end, data] of edge) {
                console.log(start, end, data.distance, data.keysNeeded.join(""), data.keysFound.join(""));
            }
        }
    }

    public solve() {
        const toVisit = new Array<[string, SortedString]>();
        const toVisitMap = new Map<string, Set<SortedString>>();
        toVisit.push(["@", sortedString("")]);
        const visited = new Map<string, Set<SortedString>>();
        const distances = new Map<string, Map<SortedString, number>>();
        this.keys.forEach(key => {
            visited.set(key, new Set());
            toVisitMap.set(key, new Set());
            distances.set(key, new Map());
        });
        visited.set("@", new Set());
        toVisitMap.set("@", new Set());
        distances.set("@", new Map());
        distances.get("@")!.set(sortedString(""), 0);
        while (toVisit.length > 0) {
            const [node, collectedKeys] = toVisit.shift()!;
            if (collectedKeys.length === this.keys.length) {
                return distances.get(node)!.get(collectedKeys);
            }
            toVisitMap.get(node)!.delete(collectedKeys);
            const distance = distances.get(node)!.get(collectedKeys)!;
            for (const [neighbour, edge] of this.neighbours(node, collectedKeys)) {
                const newKeys = addKeys(collectedKeys, neighbour, edge.keysFound.join(""));
                if (!visited.get(neighbour)!.has(newKeys)) {
                    distances.get(neighbour)!.set(newKeys,
                        Math.min(distance + edge.distance,
                            distances.get(neighbour)!.get(newKeys) || Infinity));
                    if (!toVisitMap.get(neighbour)!.has(newKeys)) {
                        toVisit.push([neighbour, newKeys]);
                        toVisitMap.get(neighbour)!.add(newKeys);
                    }
                }
            }
            visited.get(node)!.add(collectedKeys);
            toVisit.sort(([n1, k1], [n2, k2]) => distances.get(n1)!.get(k1)! - distances.get(n2!)?.get(k2)!);
        }
    }

    private neighbours(node: string, collectedKeys: SortedString) {
        return this.keys.filter(n => !collectedKeys.includes(n)
            && this.isAccessible(this.graph.get(node)?.get(n), collectedKeys))
            .map(n => [n, this.graph.get(node)!.get(n)!] as const);
    }

    private isAccessible(edge: EdgeData | undefined, collectedKeys: SortedString) {
        return edge && edge.keysNeeded.every(key => collectedKeys.includes(key));
    }

    private locationOf(name: string) {
        const startRow = this.map.findIndex(row => row.includes(name));
        const startCol = this.map[startRow].indexOf(name);
        return [startRow, startCol];
    }

    private findPaths(name: string) {
        const [startRow, startCol] = this.locationOf(name);
        const visitData: VisitData[][] = new Array(this.height);
        for (let row = 0; row < this.height; row++) {
            visitData[row] = new Array(this.width);
        }
        let toVisit = [[startRow, startCol, new VisitData(0, [], [])] as const];
        while (toVisit.length > 0) {
            const [[row, col, prevVisitData], ...rest] = toVisit;
            visitData[row][col] = prevVisitData;
            if (isLowerCase(this.map[row][col])) {
                this.addUniEdge(name, this.map[row][col], prevVisitData);
            }
            const nextData = prevVisitData.next(this.map[row][col]);
            toVisit = [...rest, ...this.findNextToVisit(row, col, nextData, visitData)];
        }
    }

    private findNextToVisit(row: number, col: number, nextData: VisitData, visitData: VisitData[][]) {
        return [[1, 0], [-1, 0], [0, 1], [0, -1]]
            .map(([dr, dc]) => [row + dr, col + dc])
            .filter(([newRow, newCol]) => this.map[newRow][newCol] !== "#"
                && visitData[newRow][newCol] === undefined)
            .map(([newRow, newCol]) => [newRow, newCol, nextData] as const);
    }

    private addUniEdge(a: string, b: string, data: VisitData) {
        if (a === b) {
            return;
        }
        if (!this.graph.has(a)) {
            this.graph.set(a, new Map());
        }
        this.graph.get(a)!.set(b, new EdgeData(data.steps, data.neededKeys, data.foundKeys));
    }

}

class EdgeData {
    constructor(
        public readonly distance: number,
        public readonly keysNeeded: readonly string[],
        public readonly keysFound: readonly string[]) { }
}

class VisitData {
    constructor(
        public readonly steps: number,
        public readonly neededKeys: readonly string[],
        public readonly foundKeys: readonly string[]) { }

    public next(t: string) {
        return new VisitData(this.steps + 1,
            isUpperCase(t) ? [...this.neededKeys, t.toLowerCase()] : this.neededKeys,
            isLowerCase(t) ? [...this.foundKeys, t] : this.foundKeys);
    }
}

function sortedString(s: string): SortedString {
    s = s.split("").sort().join("");
    const v: SortedString = s as SortedString;
    return v;
}

function addKeys(...keys: string[]): SortedString {
    const set = keys.map(s => s.split(""))
        .reduce((r, s) => r.concat(s), [])
        .reduce((r, k) => r.add(k), new Set<string>());
    const newKeys: string[] = [];
    set.forEach(k => newKeys.push(k));
    return newKeys.sort().join("") as SortedString;
}

type SortedString = string & { ___SORTED: boolean };
