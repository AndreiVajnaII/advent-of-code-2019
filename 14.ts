type Formula = Map<string, number>;

class Reaction {
    constructor(
        public quantity: number,
        public formula: Formula) {}
}

type Reactions = Map<string, Reaction>;

export function solve(lines: string[]) {
    const reactions = parseReactions(lines);
    return transform(reactions, "FUEL").needed.get("ORE");
}

function transform(reactions: Reactions, element: string) {
    let reaction = reactions.get(element)!;
    let formula = reaction.formula;
    while (!completelyTransformed(formula)) {
        const oldFormula = formula;
        formula = new Map<string, number>();
        for (const [name, q] of oldFormula) {
            if (name === "ORE") {
                addChemical(formula, name, q);
            } else {
                reaction = reactions.get(name)!;
                reaction.f
            }
        }
    }
}

function addChemical(formula: Formula, name: string, q: number) {
    const existing = formula.get(name);
    if (existing !== undefined) {
        q += existing;
    }
    formula.set(name, q);
}

function completelyTransformed(formula: Formula) {
    for (const [name, q] of formula.entries()) {
        if (name !== "ORE" && q > 0) {
            return false;
        }
    }
    return true;
}

function parseReactions(lines: string[]) {
    const reactions = new Map<string, Reaction>();
    lines.forEach(s => {
        const [left, right] = s.split(" => ");
        const [qunatity, name] = parseTerm(right);
        reactions.set(name, new Reaction(qunatity, parseFormula(left)));
    });
    return reactions;
}

function parseTerm(term: string) {
    const [q, n] = term.split(" ");
    return [+q, n] as const;
}

function parseFormula(s: string) {
    const formula = new Map<string, number>();
    s.split(", ").map(t => parseTerm(t)).forEach(([q, n]) => {
        formula.set(n, q);
    });
    return formula;
}
