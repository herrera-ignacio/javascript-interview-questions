# Hoisting

> JavaScript Hoisting refers to the process whereby the interpreter allocates memory for variable
> and function declarations prior to execution of the code. Declarations that are made using var
> are initialized with a default value of undefined. Declarations made using let and const are
> not initialized as part of hoisting. Conceptually hoisting is often presented as the interpreter
> _"splitting variable declaration and initialization, and moving (just) the declarations to the
> top of the code"_.  - [MDN](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting)

## Key points

* Functions declarations and initializations are hoisted.
* `var` declarations are hoisted.
* `const` and `let` declarations are not hoisted.

## Question 1: Function calls

What would be the output of the following code snippet:

```javascript
dogName('Pipo');

function dogName(name) {
	console.log(`My dog name is: ${name}`);
}
// Pipo
```

## Question 2: var

```javascript
console.log(num);
var num; // declaration
num = 6; // initialization

// "undefined"
```

## Question 3: var

```javascript
x = 1; // initialize x, and if not already declared, declare it.
console.log(x + "" + y);
var y = 2; // only declaration gets hoisted

// '1 undefined'
```

## Question 4: var & let

```javascript
console.log(bar); // undefined
console.log(foo); // ReferenceError
var bar = 1;
let foo = 2;
```
