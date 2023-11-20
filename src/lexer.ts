export enum TokenType {
	Number, // 0, 1, 2 ...
	Identifier, // id

	Set, // set = let
	Stuck, // stuck = const

	BinaryOperator,
	Equals, // =
	Comma, Colon, Dot, // , / :
	SemiColon, // ;
	OpenParen, // (
	CloseParen, // )
	OpenBrace, // {
	CloseBrace, // }
	OpenBracket, // [
	CloseBracket, // ]
	EOF, // end of file
}

const KEYWORDS: Record<string, TokenType> = {
	set: TokenType.Set,
	stuck: TokenType.Stuck,
};

export interface Token {
	value: string;
	type: TokenType;
}

function token(value = "", type: TokenType): Token {
	return { value, type };
}

function isal(src: string) {
	return src.toUpperCase() != src.toLowerCase();
}

function isskip(str: string) {
	return str == " " || str == "\n" || str == "\t" || str == "\r";
}

function isint(str: string) {
	const c = str.charCodeAt(0);
	const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
	return c >= bounds[0] && c <= bounds[1];
}

export function tokenize(sourceCode: string): Token[] {
	const tokens = new Array<Token>();
	const src = sourceCode.split("");

	while (src.length > 0) {
		if (src[0] == "(") {
			tokens.push(token(src.shift(), TokenType.OpenParen));
		} else if (src[0] == ")") {
			tokens.push(token(src.shift(), TokenType.CloseParen));
		} else if (src[0] == "{") {
			tokens.push(token(src.shift(), TokenType.OpenBrace));
		} else if (src[0] == "}") {
			tokens.push(token(src.shift(), TokenType.CloseBrace));
		} else if (src[0] == "[") {
			tokens.push(token(src.shift(), TokenType.OpenBracket));
		} else if (src[0] == "]") {
			tokens.push(token(src.shift(), TokenType.CloseBracket));
		} else if (src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/" || src[0] == "%") {
			tokens.push(token(src.shift(), TokenType.BinaryOperator));
		} else if (src[0] == "=") {
			tokens.push(token(src.shift(), TokenType.Equals));
        } else if (src[0] == ";") {
			tokens.push(token(src.shift(), TokenType.SemiColon));
        } else if (src[0] == ":") {
			tokens.push(token(src.shift(), TokenType.Colon));
        } else if (src[0] == ",") {
			tokens.push(token(src.shift(), TokenType.Comma));
        } else if (src[0] == ".") {
			tokens.push(token(src.shift(), TokenType.Dot));
        } else {
			if (isint(src[0])) {
				let num = "";
				while (src.length > 0 && isint(src[0])) {
					num += src.shift();
				}

				tokens.push(token(num, TokenType.Number));
            } else if (isal(src[0])) {
				let ident = "";
				while (src.length > 0 && isal(src[0])) {
					ident += src.shift();
				}

				const reserved = KEYWORDS[ident];
				if (typeof reserved == "number") {
					tokens.push(token(ident, reserved));
				} else {
					tokens.push(token(ident, TokenType.Identifier));
				}
			} else if (isskip(src[0])) {
				src.shift();
			} else {
				console.error(
					"psharp.core: unreconized character found in source: ",
					src[0].charCodeAt(0),
					src[0]
				);
				Deno.exit(1);
			}
		}
	}

	tokens.push({ type: TokenType.EOF, value: "EndOfFile" });
	return tokens;
}