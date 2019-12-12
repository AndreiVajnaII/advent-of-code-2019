import { start } from "repl";

class Asteroid {
    public seenAsteroids = 0;

    constructor(
        public x: number,
        public y: number) {}
}

class LineOfSight {
    constructor(
        private startX: number,
        private startY: number,
        private dx: number,
        private dy: number) {}

    public sees(a: Asteroid): boolean {
        if (a.x === this.startX && a.y === this.startY) {
            return false;
        }
        if (a.x === this.startX) {
            return this.dx === 0 && Math.sign(a.y - this.startY) === Math.sign(this.dy);
        }
        if (a.y === this.startY) {
            return this.dy === 0 && Math.sign(a.x - this.startX) === Math.sign(this.dx);
        }
        return (a.x - this.startX) / this.dx === (a.y - this.startY) / this.dy
            && Math.sign(a.x - this.startX) === Math.sign(this.dx)
            && Math.sign(a.y - this.startY) === Math.sign(this.dy);
    }
}

export function solve(lines: string[]) {
    const [a, r] = new MonitoringStationFinder(lines).findBest();
    return [a.x, a.y, r];
}

class MonitoringStationFinder {

    private w: number;
    private h: number;
    private asteroids: Asteroid[];

    constructor(lines: string[]) {
        this.w = lines[0].length;
        this.h = lines.length;
        this.asteroids = lines.join("").split("").map((v, i) => [v, i] as const).filter(([v, _]) => v === "#")
            .map(([_, i]) => new Asteroid(i % this.w, Math.floor(i / this.h)));
    }

    public findBest() {
        return this.asteroids.map(a => [a, this.countSeenAsteroids(a)] as const)
            .reduce(([amax, max], [a, v]) => v > max ? [a, v] : [amax, max]);
    }

    public countSeenAsteroids(a: Asteroid) {
        return this.linesOfSight(a.x, a.y)
            .filter(lineOfSight => this.asteroids.some(asteroid => lineOfSight.sees(asteroid))).length;
    }

    public linesOfSight(startX: number, startY: number): LineOfSight[] {
        const linesOfSight: LineOfSight[] = [];
        for (let x = 0; x < this.w; x++) {
            for (let y = 0; y < this.h; y++) {
                if (x === startX && y === startY) {
                    continue;
                }
                const dx = x - startX;
                const dy = y - startY;
                if (gcd(Math.abs(dx), Math.abs(dy)) === 1) {
                    linesOfSight.push(new LineOfSight(startX, startY, dx, dy));
                }
            }
        }
        return linesOfSight;
    }
}

function gcd(a: number, b: number): number {
    if (a === 0) {
        return b;
    }
    if (b === 0) {
        return a;
    }
    if (a === b) {
        return a;
    }
    if (a > b) {
        return gcd(a - b, b);
    } else {
        return gcd(a, b - a);
    }
}