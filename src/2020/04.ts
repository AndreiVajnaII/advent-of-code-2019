export function solve(lines: string[]) {
    return groupPassportLines(lines).map(parsePassportLine).filter(isValid).length;
}

// TODO: improve
function groupPassportLines(lines: string[]) {
    return lines.reduce((passportLines: string[], line: string) => {
        if (line === "") {
            return [...passportLines, ""];
        } else {
            passportLines[passportLines.length - 1] += " " + line;
            return passportLines;
        }
    }, [""]);
}

function isValid(passport: PotentialPassport) {
    return validators.every(([field, validator]) => isValidField(passport[field], validator));
}

function isValidField(fieldValue: string | undefined, validator: (s: string) => boolean) {
    return fieldValue && validator(fieldValue);
}

// TODO: Object.fromEntries
function parsePassportLine(passportLine: string) {
    return passportLine.split(" ").map(field => field.split(":") as [RequiredPassportField, string])
        .reduce((result: PotentialPassport, [field, value]) => {
            result[field] = value;
            return result;
        }, {});
}

const validators = [
    ["byr", numberValidator(1920, 2002)] as const,
    ["iyr", numberValidator(2010, 2020)] as const,
    ["eyr", numberValidator(2020, 2030)] as const,
    ["hgt", heightValidator] as const,
    ["hcl", regexValidator(/^#[0-9a-f]{6}$/)] as const,
    ["ecl", regexValidator(/^amb|blu|brn|gry|grn|hzl|oth$/)] as const,
    ["pid", regexValidator(/^\d{9}$/)] as const,
];

type RequiredPassportField = typeof validators extends Array<readonly [infer R, (s: string) => boolean]> ? R: never;
type PotentialPassport = Partial<Record<RequiredPassportField, string>>;

function numberValidator(min: number, max: number) {
    return (s: string) => min <= (+s) && (+s) <= max;
}

const heightValidators = {
    cm: numberValidator(150, 193),
    in: numberValidator(59, 76),
};

function heightValidator(s: string) {
    const m = /(\d+)(cm|in)/.exec(s);
    return !!m && heightValidators[m[2] as "cm" | "in"](m[1]);
}

function regexValidator(r: RegExp) {
    return (s: string) => r.test(s);
}
