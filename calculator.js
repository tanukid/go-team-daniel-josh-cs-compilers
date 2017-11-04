function Calculator(inputString) {
  this.lexer(inputString);
  this.tokenStream;
}

Calculator.prototype.lexer = function (inputString) {
  let tokenTypes = [
    ["NUMBER", /^\d+/],
    ["ADD", /^\+/],
    ["SUB", /^\-/],
    ["MUL", /^\*/],
    ["DIV", /^\//],
    ["LPAREN", /^\(/],
    ["RPAREN", /^\)/]
  ];

  this.tokenStream = inputString.split('')
    .map(value => ({
      name: tokenTypes.find(type => type[1].test(value))[0],
      value
    }))
}
// peek should return the next token from this.tokenStream but not modify tokenStream
Calculator.prototype.peek = function () {
  return this.tokenStream[0] || null;
}
// while get should return the next token and remove it from the tokenStream.
Calculator.prototype.get = function () {
  // shift mutates the original array
  return this.tokenStream.shift();
}

/* Grammar Rules
    E = Term A
*/

Calculator.prototype.parseExpression = function () {
  var term = this.parseTerm();
  var a = this.parseA();

  return new TreeNode("Expression", term, a);
};

/*
    A = + Term A
    A = - Term A
    A = epsilon ("")
*/
Calculator.prototype.parseA = function () {
  var nextToken = this.peek();
  if (nextToken && nextToken.name === "ADD") {
    // + TERM A
    this.get(); // Pulls the plus sign off the token string
    // parseA - right recursion because A is on the right hand side.
    // Already modified the token string.
    return new TreeNode("A", "+", this.parseTerm(), this.parseA());
  } else if (nextToken && nextToken.name == "SUB") {
    // - TERM A
    this.get(); // Pulls the minus sign off the token string
    return new TreeNode("A", "-", this.parseTerm(), this.parseA());
  } else {
    // EPISOLON ('')
    return new TreeNode("A")
  }
};

Calculator.prototype.parseTerm = function () {
  let factor = this.parseFactor();
  let b = this.parseFactor();

  return new TreeNode('Term', factor, b);
}
// + - * / => lowe rin the tree the higher the presidence.
// Lower in the tree the closer you are to to the terminals.
// * F B
// / F B
// eps
Calculator.prototype.parseB = function () {
  var nextToken = this.peek();
  if (nextToken && nextToken.name === "MUL") {
    // * TERM B
    this.get();
    return new TreeNode("B", "*", this.parseFactor(), this.parseB());
  } else if (nextToken && nextToken.name == "DIV") {
    // / TERM B
    this.get(); // Pulls the minus sign off the token string
    return new TreeNode("B", "/", this.parseFactor(), this.parseB());
  } else {
    // EPISILON ('')
    return new TreeNode("B")
  }
};

// Factor => Number
//  | ( Expression )
//  | - Factor
//
Calculator.prototype.parseFactor = function () {
  const nextToken = this.peek();
  if (nextToken.name === 'NUMBER') {
    return new TreeNode('Factor', this.get().value);
  } else if (nextToken.name === 'LPAREN') {
    // (E)
    this.get();
    let expr = this.parseExpression();
    this.get()
    return new TreeNode('Factor', '(' + expr + ')');
  } else if (nextToken.name === 'SUB') {
    // - Factor
    // 1 + -(3*4)
    return new TreeNode('Factor', '-', this.parseFactor());
  } else {
    throw new Error('Expected to get Factor, did not find anything.')
  }
}

function TreeNode(name, ...children) {
  this.name = name;
  this.children = children;
}

module.exports = { Calculator, TreeNode };
