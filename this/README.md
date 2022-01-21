# this

> A function's `this` keyword behaves a little differently in JavaScript and has some differences between strict and non-strict mode.

- [this](#this)
  - [Overview](#overview)
  - [Object Context](#object-context)
  - [Class Context](#class-context)
  - [Function Context](#function-context)
    - [Example 1: `call` and `apply`](#example-1-call-and-apply)
    - [Example 2: `call` and `apply` w/arguments](#example-2-call-and-apply-warguments)
    - [Example 3: `call`](#example-3-call)
    - [Example 4: `bind`](#example-4-bind)
  - [Arrow Functions](#arrow-functions)
    - [Example 1: Used as method (don't!)](#example-1-used-as-method-dont)
    - [Example 2: `Object.defineProperty()` (don't!)](#example-2-objectdefineproperty-dont)
    - [Example 3: Closures (yes!)](#example-3-closures-yes)
      - [Problem](#problem)
      - [Solution](#solution)

## Overview

In most cases, the value of `this` is determined by how a function is called (*runtime binding*).

ES5 introduced the `bind()` method to **set the value** of a function's `this` regardless of how it's called.

ES2015 introduced *arrow functions* which don't provide their own `this` binding but instead, they retain the `this` binding of the enclosing scope.

## Object Context

```js
const test = {
  prop: 'test',
  func: function() {
    return this.prop;
  }
}

console.log(test.func()); // 'test'

const anotherTest = {
  prop: 'anotherTest',
  func: test.func,
}

console.log(anotherTest.func()); // 'anotherTest'
```

## Class Context

```js
class Example {
  constructor() {
    const proto = Object.getPrototypeOf(this);
    console.log(Object.getOwnPropertyNames(proto));
  }
  first(){}
  second(){}
  static third(){}
}

new Example(); // ['constructor', 'first', 'second']
```

## Function Context

### Example 1: `call` and `apply`

```js
// An object can be passed as the first argument to call or apply and this will be bound to it.
var obj = {a: 'Custom'};

// We declare a variable and the variable is assigned to the global window as its property.
var a = 'Global';

function whatsThis() {
  return this.a;  // The value of this is dependent on how the function is called
}

whatsThis();          // 'Global' as this in the function isn't set, so it defaults to the global/window object
whatsThis.call(obj);  // 'Custom' as this in the function is set to obj
whatsThis.apply(obj); // 'Custom' as this in the function is set to obj
```

### Example 2: `call` and `apply` w/arguments

```js
function add(c, d) {
  return this.a + this.b + c + d;
}

var o = {a: 1, b: 3};

// The first parameter is the object to use as
// 'this', subsequent parameters are passed as
// arguments in the function call
add.call(o, 5, 7); // 16

// The first parameter is the object to use as
// 'this', the second is an array whose
// members are used as the arguments in the function call
add.apply(o, [10, 20]); // 34
```

### Example 3: `call`

```js
function bar() {
  console.log(Object.prototype.toString.call(this));
}

bar.call(7);     // [object Number]
bar.call('foo'); // [object String]
bar.call(undefined); // [object global]
```

### Example 4: `bind`

```js
function f() {
  return this.a;
}

var g = f.bind({a: 'azerty'});
console.log(g()); // azerty

var h = g.bind({a: 'yoo'}); // bind only works once!
console.log(h()); // azerty

var o = {a: 37, f: f, g: g, h: h};
console.log(o.a, o.f(), o.g(), o.h()); // 37,37, azerty, azerty
```

## Arrow Functions

In arrow functions, `this` retains the value of the enclosing scope (lexical context)'s this. In global code, it will be set to the global object.

* Do not have a `prototype` property.
* Not suitable for `call`, `apply` aand `bind` methods.
* Cannot be used as *constructors*.
* Cannot use `yield` within its body.

> Perhaps the greatest benefit of using Arrow functions is with DOM-level methods (setTimeout, setInterval, addEventListener) that usually required some kind of closure, call, apply or bind to ensure the function executed in the proper scope.

### Example 1: Used as method (don't!)

```js

var obj = { // does not create a new scope
  i: 10,
  b: () => console.log(this.i, this),
  c: function() {
    console.log(this.i, this);
  }
}

obj.b(); // prints undefined, Window {...} (or the global object)
obj.c(); // prints 10, Object {...}
```

### Example 2: `Object.defineProperty()` (don't!)

```js
var obj = {
  a: 10
};

Object.defineProperty(obj, 'b', {
  get: () => {
    console.log(this.a, typeof this.a, this); // undefined 'undefined' Window {...} (or the global object)
    return this.a + 10; // represents global object 'Window', therefore 'this.a' returns 'undefined'
  }
});
```

### Example 3: Closures (yes!)

#### Problem 

```js
var obj = {
    count : 10,
    doSomethingLater : function (){
        setTimeout(function(){ // the function executes on the window scope
            this.count++;
            console.log(this.count);
        }, 300);
    }
}

obj.doSomethingLater(); // console prints "NaN", because the property "count" is not in the window scope

obj.doSomethingLater.bind(obj)(); // console prints "11"
```

#### Solution

```js
var obj = {
    count : 10,
    doSomethingLater : function(){
        // The traditional function binds "this" to the "obj" context.
        setTimeout( () => {
            // Since the arrow function doesn't have its own binding and
            // setTimeout (as a function call) doesn't create a binding
            // itself, the "obj" context of the traditional function will
            // be used within.
            this.count++;
            console.log(this.count);
        }, 300);
    }
}

obj.doSomethingLater();
```

### Example 4: setTimeout and closures simplified

```javascript
this.i = 1;

setTimeout(function() { // executes in own timeout context
	console.log(this.i) // undefined
}, 100)
```

```javascript
this.i = 1;

setTimeout(() => { // does not bind context, so it uses window context
	console.log(this.i) // 1
})
```
