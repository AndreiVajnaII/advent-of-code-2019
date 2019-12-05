import request = require("request");

export function readInput(inputUrl: string, cookie: string, parseInput: (lines: string[]) => any) {
    request(inputUrl, { headers: { cookie } }, (err, res, body: string) => {
        if (res.statusCode !== 200) {
            console.error(err);
            console.log(res.statusCode, res.statusMessage);
            console.debug(body);
        } else {
            const lines = body.split("\n");
            lines.pop();
            console.log(parseInput(lines));
        }
    });
}
