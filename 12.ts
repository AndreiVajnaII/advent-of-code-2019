const axes = ["x", "y", "z"] as const;

class Vector {
    constructor(
        public x: number,
        public y: number,
        public z: number,
    ) { }

    get energy() {
        return axes.map(axis => Math.abs(this[axis])).reduce((r, x) => r + x);
    }
}

class Moon {
    public velocity = new Vector(0, 0, 0);

    constructor(
        public position: Vector,
    ) { }

    get potentialEnergy() {
        return this.position.energy;
    }

    get kineticEnergy() {
        return this.velocity.energy;
    }

    get totalEnergy() {
        return this.potentialEnergy * this.kineticEnergy;
    }
}

function applyGravity(m1: Moon, m2: Moon) {
    axes.forEach(axis => {
        m1.velocity[axis] += Math.sign(m2.position[axis] - m1.position[axis]);
        m2.velocity[axis] += Math.sign(m1.position[axis] - m2.position[axis]);
    });
}

function applyVelocity(m: Moon) {
    axes.forEach(axis => {
        m.position[axis] += m.velocity[axis];
    });
}

export function solve(lines: string[]) {
    const moons = lines.map(parseVector).map(v => new Moon(v));
    for (let step = 0; step < 1000; step++) {
        for (let i = 0; i < moons.length - 1; i++) {
            for (let j = i + 1; j < moons.length; j++) {
                applyGravity(moons[i], moons[j]);
            }
        }
        moons.forEach(applyVelocity);
    }
    return moons.map(m => m.totalEnergy).reduce((r, x) => r + x);
}

function parseVector(line: string) {
    const m = /<x=([^,]+), y=([^,]+), z=([^>]+)>/.exec(line);
    if (!m) {
        throw new Error("error parsing input");
    }
    return new Vector(+m[1], +m[2], + m[3]);
}
