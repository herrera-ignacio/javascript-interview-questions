# Hoisting

- [Hoisting](#hoisting)
  - [Overview](#overview)
  - [Question 1: Function hoisting](#question-1-function-hoisting)
  - [Question 3: var declaration hoisting](#question-3-var-declaration-hoisting)
  - [Question 4: var declaration hoisting](#question-4-var-declaration-hoisting)
  - [Question 5: let doesn't get hoisted](#question-5-let-doesnt-get-hoisted)

## Overview

JavaScript Hoisting refers to the process whereby the interpreter allocates memory for variable and function declarations prior to execution of the code.
Conceptually hoisting is often presented as the interpreter "splitting variable declaration and initialization, and moving the declarations to the top of the code".

- Declarations that are made using `var` are initialized with a default value of `undefined`.
- Declarations made using `let` and `const` are not initialized as part of hoisting.
- Functions declarations and initializations are hoisted.

> [MDN documentation](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting)

## Question 1: Function hoisting

What would be the output of the following code snippet:

```javascript
dogName('Pipo');

function dogName(name) {
  console.log(`My dog name is: ${name}`);
}
```

Answer:

```js
// My dog name is: Pipo
```

## Question 3: var declaration hoisting

What would be the output of the following code snippet:

```javascript
console.log(num);
var num; // declaration
num = 6; // initialization
```

Answer:

```js
// undefined
```

## Question 4: var declaration hoisting

What would be the output of the following code snippet:

```javascript
x = 1; // initialize x, and if not already declared, declare it.
console.log(x + "" + y);
var y = 2; // only declaration gets hoisted

// '1 undefined'
```

## Question 5: let doesn't get hoisted

What would be the output of the following code snippet:

```javascript
console.log(bar); // undefined
console.log(foo); // ReferenceError
var bar = 1;
let foo = 2;
```
