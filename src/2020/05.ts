export function solve(lines: string[]) {
    const seats =  lines.map(line => line.split("") as BoardingPassString)
        .map(boardingPass => decodeBSP(boardingPass));
    return [seats.reduce((max, v) => v > max ? v : max),
        findMySeat(seats)];
}

function findMySeat(seats: number[]) {
    const sortedSeats = seats.sort();
    for (let i = 1; i < sortedSeats.length; i++) {
        if (sortedSeats[i] - sortedSeats[i-1] === 2) {
            return sortedSeats[i] - 1;
        }
    }
}

function decodeBSP(s: BoardingPassString, result = 0): number {
    return s.length === 0 ? result
        : decodeBSP(s.slice(1), result * 2 + charValues[s[0]]);
}

const charValues = {
    F: 0,
    B: 1,
    R: 1,
    L: 0,
};

type BoardingPassString = Array<keyof typeof charValues>;
