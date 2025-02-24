# Closure

## Overview

A closure in JavaScript is the combination of a function and its lexical scope.

It's useful because it lets a function "remember" the variables from an outer function even after the outer function has finished executing.

## Data encapsulation

Closures allow an inner function to access and manipulate variables from its "parent" scope enabling data encapsulation of "private" variables.

In the following example, `count` is private and can only be modified through the methods.

```javascript
function outerFunction() {
  let count = 0; // Local variable in outer function

  return function innerFunction() {
    count++; // Inner function remembers `count`
    console.log(count);
  };
}

const counter = outerFunction();
counter(); // 1
counter(); // 2
counter(); // 3
```

## Event listeners

Closures are often used in event listeners to ensure the function retains access to the variables in the parent scope.

```javascript
function attachEvent() {
  let counter = 0;
  document.querySelector("button").addEventListener("click", function () {
    counter++;
    console.log(counter);
  });
}
attachEvent();
```

## Function factories

You can use closures to create function factories or high order functions.

```javascript
function multiplier(factor) {
  return function (number) {
    return number * factor;
  };
}

const double = multiplier(2);
console.log(double(5)); // 10

const triple = multiplier(3);
console.log(triple(5)); // 15
```
