export function solve(lines: string[]) {
    const cubeSpace = new CubeSpace(lines.map(line => line.split("") as CubeState[]));
    for (let i = 0; i < 6; i++) {
        cubeSpace.evolve();
    }
    return cubeSpace.count;
}

class CubeSpace {
    private cubes: RecursiveArray<CubeState>;

    constructor(initial: CubeState[][]) {
        this.cubes = newRecursiveArray<CubeState>([1, 1, initial.length, initial[0].length]);
        for (let y = 0; y < initial.length; y++) {
            for (let x = 0; x < initial[y].length; x++) {
                setValue(this.cubes, [0, 0, y, x], initial[y][x]);
            }
        }
    }

    public get count() {
        return this.cubes.flat(3).filter(cube => cube === "#").length;
    }

    public evolve() {
        pad<CubeState>(this.cubes, ".");
        const newCubes: RecursiveArray<CubeState> = newRecursiveArray(getLengths(this.cubes));
        forEach(this.cubes, (cube: CubeState, coords) => {
            const activeNeighbours = neighbours(getDimensions(this.cubes))
                .map(delta => coords.map((coord, i) => coord + delta[i]))
                .filter(newCoords => isInBounds(this.cubes, newCoords))
                .map(newCoords => getValue<CubeState>(this.cubes, newCoords))
                .filter(c => c === "#").length;
            if (cube === "#") {
                setValue(newCubes, coords, activeNeighbours === 2 || activeNeighbours === 3 ? "#" : ".");
            } else {
                setValue(newCubes, coords, activeNeighbours === 3 ? "#" : ".");
            }
        });
        this.cubes = newCubes;
    }
}

function newRecursiveArray<T>([length, ...rest]: number[]): RecursiveArray<T> {
    if (rest.length === 0) {
        return new Array<T>(length);
    } else {
        const result = new Array<RecursiveArray<T>>(length);
        for (let i = 0; i < result.length; i++) {
            result[i] = newRecursiveArray(rest);
        }
        return result;
    }
}

function getLengths(array: RecursiveArray<unknown>): number[] {
    return [array.length].concat(isOneDimensional(array) ? [] : getLengths(array[0]));
}

function getDimensions(array: RecursiveArray<unknown>): number {
    return isOneDimensional(array) ? 1 : 1 + getDimensions(array[0]);
}

function getValue<T>(array: RecursiveArray<T>, [index, ...rest]: number[]): T {
    return isOneDimensional(array) ? array[index] : getValue(array[index], rest);
}

function setValue<T>(array: RecursiveArray<T>, [index, ...rest]: number[], value: T) {
    if (isOneDimensional(array)) {
        array[index] = value;
    } else {
        setValue(array[index], rest, value);
    }
}

function pad<T>(space: RecursiveArray<T>, value: T) {
    if (isOneDimensional(space)) {
        space.push(value);
        space.unshift(value);
    } else {
        for (const layer of space) {
            pad(layer, value);
        }
        space.push(newLayer(space[0], value));
        space.unshift(newLayer(space[0], value));
    }
}

function newLayer<T>(space: RecursiveArray<T>, value: T): RecursiveArray<T> {
    if (isOneDimensional(space)) {
        return new Array<T>(space.length).fill(value);
    } else {
        const result = new Array<RecursiveArray<T>>(space.length);
        for (let i = 0; i < result.length; i++) {
            result[i] = newLayer(space[0], value);
        }
        return result;
    }
}

function isInBounds(array: RecursiveArray<unknown>, [index, ...rest]: number[]): boolean {
    return 0 <= index && index < array.length
        && (isOneDimensional(array) || isInBounds(array[0], rest));
}

function forEach<T>(
    array: RecursiveArray<T>,
    f: (element: T, indices: number[]) => void,
    currentIndices: number[] = []) {
    if (isOneDimensional(array)) {
        array.forEach((el, index) => f(el, currentIndices.concat(index)));
    } else {
        array.forEach((subArray, index) => forEach(subArray, f, currentIndices.concat(index)));
    }
}

function isOneDimensional<T>(space: RecursiveArray<T>): space is T[] {
    return space.length > 0 && !Array.isArray(space[0]);
}

const neighbours1 = [[0], [1], [-1]];

function neighbours(dimensions: number, top = true): number[][] {
    if (dimensions === 1) {
        return neighbours1;
    } else {
        const result = neighbours(dimensions - 1, false).flatMap(r => neighbours1.map(n => n.concat(r)));
        if (top) {
            return result.slice(1);
        } else {
            return result;
        }
    }
}

type CubeState = "#" | ".";

type RecursiveArray<T> = T[] | Array<RecursiveArray<T>>;
