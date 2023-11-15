export enum TokenType { // handle token type
    Num,
    Id,
    Eq,
    Set,
    BinaryOp,
    OpenPar,
    ClosePar,
}

export interface Token { // handle token
    value: string,
    type: TokenType,
}

function token(value = "", type: TokenType) : Token { // macro
    return {value, type};
}

function isal(src: string) {
    return src.toUpperCase() != src.toLowerCase();
}

function isint(src: string) { // check int
    const c = src.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];

    return (c >= bounds[0] && c <= bounds[1]);
}

export function tokenizeCode (source: string): Token[] {
    const tokens = new Array<Token>();
    const src = source.split("");

    while (src.length > 0) { // build each util end
        if(src[0] == '(') {
            tokens.push(token(src.shift(), TokenType.OpenPar))
        } else if(src[0] = ')') {
            tokens.push(token(src.shift(), TokenType.ClosePar))
        } else if(src[0] = '+' || src[0] == '-' || src[0] == '*' || src[0] == '/') {
            tokens.push(token(src.shift(), TokenType.BinaryOp))
        } else if(src[0] == "=") {
            tokens.push(token(src.shift(), TokenType.Eq))
        } else {
            if(isint(src[0])) { // build num
                let num = "";

                while(src.length > 0 && isint(src[0])) {
                    num += src.shift();
                }

                tokens.push(token(num, TokenType.Num));
            } else if(isal(src[0])) {
                let id = "";

                while(src.length > 0 && isal(src[0])) {
                    id += src.shift();
                }

                tokens.push(token(id, TokenType.Id));
            }
        }
    }

    return tokens;
}