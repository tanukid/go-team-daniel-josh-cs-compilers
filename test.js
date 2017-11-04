const { Calculator, TreeNode } = require('./calculator.js')

test('Parses correctly', () => {
  const calculator = new Calculator('1+(2*3)+4')
  console.log(calculator)
  expect(calculator.tokenStream).toEqual([
    { name: "NUMBER", value: "1" },
    { name: "ADD", value: "+" },
    { name: "LPAREN", value: "(" },
    { name: "NUMBER", value: "2" },
    { name: "MUL", value: "*" },
    { name: "NUMBER", value: "3" },
    { name: "RPAREN", value: ")" },
    { name: "ADD", value: "+" },
    { name: "NUMBER", value: "4" }
  ])
});

test('Building the Tree', () => {
  const treeNode = new TreeNode('NUMBER', 1, 2)
  expect(treeNode.name).toEqual('NUMBER')
  expect(treeNode.children).toEqual([1, 2]);
})

test('Parse Expression', () => {
  const calculator = new Calculator('1+(2*3)+4')
  expect(calculator.parseExpression()).toEqual()
})
