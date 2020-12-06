import { CollectFunction, groupLines, intersect, sum, union } from "../utils";

export function solve(lines: string[]) {
    return [
        countAnswers(lines, union),
        countAnswers(lines, intersect),
    ];
}

function countAnswers(lines: string[], collect: CollectFunction<string>) {
    return groupLines(lines)
        .map(splitAnswers)
        .map(collectAnswers(collect))
        .map(answers => answers.size)
        .reduce(sum);
}

function splitAnswers(group: string[]) {
    return group.map(s => new Set(s.split("")));
}

function collectAnswers(collect: CollectFunction<string>) {
    return (answers: Array<Set<string>>) => answers.reduce(collect);
}
