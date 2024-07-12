// Let x = 45
// [LetToken, IdentiferTK, EqualsToken, NumberToken]

// Represents tokens that our language understands in parsing.
export enum TokenType {
	// Literal Types
	Number,
	Identifier,

    // Keywords
	Let,
    
    // Grouping * Operators
    BinaryOperator,
    Equals,
    OpenParen,
    CloseParen,
    EOF,

}

const KEYWORDS: Record<string, TokenType> = {
    "let": TokenType.Let,
}

// Represents a single token from the source-code.
export interface Token {
	value: string; // contains the raw value as seen inside the source code.
	type: TokenType; // tagged structure.
}

function token (value = "", type: TokenType): Token {
    return { value, type };
}

function isalpha (src: string) {
    return src.toUpperCase() != src.toLowerCase();
}

function isskippable (str: string){
    return str == ' ' || str == '\n' || str == '\t';
}

function isint(str: string) {
	const c = str.charCodeAt(0);
	const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
	return (c >= bounds[0] && c <= bounds[1]);
}

export function tokenize(SourceCode: string): Token[] {
    const tokens = new Array<Token>();
    const src = SourceCode.split("");

    //Build each token until EOF
    while (src.length > 0) {
        if (src[0] == '('){
            tokens.push(token(src.shift(), TokenType.OpenParen));
        } else if (src[0] == ')'){
            tokens.push(token(src.shift(), TokenType.CloseParen));
        } else if (src[0] == '+' || src[0] == '-' || src[0] == '*' || src[0] == '/'){
            tokens.push(token(src.shift(), TokenType.BinaryOperator));
        } else if (src[0] == '='){
            tokens.push(token(src.shift(), TokenType.Equals));
        } else { //Handles multi-character tokens

            if (isint(src[0])) {
				let num = "";
				while (src.length > 0 && isint(src[0])) {
					num += src.shift();
				} 

				// append new numeric token.
				tokens.push(token(num, TokenType.Number));
			} else if (isalpha(src[0])){
                let ident = "";
                while (src.length > 0 && isalpha(src[0])) {
					ident += src.shift();
				}
                //check for reserved keywords
                const reserved = KEYWORDS[ident];
                if(reserved == undefined){
                    tokens.push(token(ident, TokenType.Identifier));
                } else {
                    tokens.push(token(ident, reserved));
                }
                
            } else if (isskippable(src[0])){
                src.shift();
            } else {
                console.log("Unrecognized char found insrc: ", src[0]);
                Deno.exit(1);
            }

        }
    }
    tokens.push({type: TokenType.EOF, value: "EOF"})
    return tokens;
}


const source = await Deno.readTextFile("./test.txt");
for (const token of tokenize(source)){
    console.log(token);
}
