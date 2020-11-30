import request = require("request");

export function readInput(inputUrl: string, cookie: string, parseInput: (lines: string[]) => unknown) {
    request(inputUrl, { headers: { cookie } }, (err, res, body: string) => {
        if (res.statusCode !== 200) {
            console.error(err);
            console.log(res.statusCode, res.statusMessage);
            console.debug(body);
        } else {
            const lines = body.split("\n");
            lines.pop();
            const result = parseInput(lines);
            if (result instanceof Promise) {
                result.then(console.log, console.error);
            } else {
                console.log(result);
            }
        }
    });
}
