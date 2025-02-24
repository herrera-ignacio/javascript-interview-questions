# this

> A function's `this` keyword behaves a little differently in JavaScript and has some differences between strict and non-strict mode.

- [this](#this)
  - [Overview](#overview)
  - [Global context](#global-context)
  - [Inside a function: default binding](#inside-a-function-default-binding)
  - [Object method: implicit binding](#object-method-implicit-binding)
  - [Classes: `new` binding](#classes-new-binding)
  - [Event listeners: triggered event](#event-listeners-triggered-event)
  - [Arrow functions: lexical scope](#arrow-functions-lexical-scope)
    - [Example: Binding to enclosing scope](#example-binding-to-enclosing-scope)
    - [Example: Used as method (don't!)](#example-used-as-method-dont)
    - [Example: `Object.defineProperty()` (don't!)](#example-objectdefineproperty-dont)
    - [Example: Closures for object methods](#example-closures-for-object-methods)
  - [Explicit binding](#explicit-binding)
    - [Using `call`](#using-call)
    - [Using `bind`](#using-bind)
    - [Using `call` and `apply`](#using-call-and-apply)
    - [Using `call` and `apply` with arguments](#using-call-and-apply-with-arguments)

## Overview

- The `this` keyword in JavaScript refers to __the context in which a function is executed__.
- In most cases, the value of `this` is determined by how a function is called (*runtime binding*).
- ES5 introduced the `bind()` method to **set the value** of a function's `this` regardless of how it's called.
- ES2015 introduced *arrow functions* which don't provide their own `this` binding but instead, they retain the `this` binding of the enclosing scope.

## Global context

In the global scope (no enclosing function), `this` refers to the global object (window in browsers).

```js
console.log(this); // window (in browsers)
```

## Inside a function: default binding

In non-strict mode, `this` refers to the global object (window in browsers).
In strict mode, `this` is undefined.

```javascript
function showThis() {
  console.log(this);
}
showThis(); // window (or undefined in strict mode)
```

## Object method: implicit binding

When a function is called as an object’s method, this refers to that object.

Question: What will be the output of the following code?

```js
const test = {
  prop: 'test',
  func: function() {
    return this.prop;
  }
}

console.log(test.func());

const anotherTest = {
  prop: 'anotherTest',
  func: test.func,
}

console.log(anotherTest.func());
```

Answer:

```javascript
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

## Classes: `new` binding

When a function is called with the `new` keyword (i.e., a _constructor function_), `this` refers to the newly created object.

```js
function Person(name) {
  this.name = name;
}
const user = new Person("Nacho");
console.log(user.name); // "Nacho"
```

The same applies for ES6 class definitions and object methods:

```js
class Person {
  constructor(name) {
    this.name = name; // `this` refers to the instance
  }

  sayHello() {
    console.log(`Hello, my name is ${this.name}`);
  }
}

const user = new Person("Nacho");
user.sayHello(); // "Hello, my name is Nacho"
```

Not that for static methods, `this` refers to the class itself, not an instance of the class.

## Event listeners: triggered event

Inside event listeners/handlers, `this` refers to the element that triggered the event.

```javascript
document.querySelector("button").addEventListener("click", function () {
  console.log(this); // Refers to the clicked button
});
```

## Arrow functions: lexical scope

In arrow functions, `this` retains the value of the enclosing scope (lexical context)'s this.

Some properties of arrow functions:

- Do not have a `prototype` property.
- Not suitable for `call`, `apply` aand `bind` methods.
- Cannot be used as *constructors*.
- Cannot use `yield` within its body.

For example, if you use an arrow function in the global scope, it will be set to the global object. Where as if you use it inside another function, it will be set to the value of the `this` keyword of that function.

> One benefit of using Arrow functions is with DOM-level methods (setTimeout, setInterval, addEventListener) that usually required some kind of closure, call, apply or bind to ensure the function executed in the proper scope.

### Example: Binding to enclosing scope

Consider the following example that demonstrates how arrow functions can be used to bind to the enclosing scope:

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

### Example: Used as method (don't!)

Because `obj.b` is an arrow function, it will not use the object's context and will use the `this` value of the enclosing scope instead.

```js
var obj = {
  i: 10,
  b: () => console.log(this.i, this), // does not bind to obj context
  c: function() {
    console.log(this.i, this); // binds to obj context
  }
}

obj.b(); // prints undefined, Window {...} (or the global object)
obj.c(); // prints 10, Object {...}
```

### Example: `Object.defineProperty()` (don't!)

Same as the example above. `obj.b` is an arrow function and will not bind to the object's context.

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

### Example: Closures for object methods

Sometimes functions need to be explicitly bound to the object's context (e.g., `setTimeout`). Consider the following example:

```js
var obj = {
    count : 10,
    doSomethingLater : function (){
        setTimeout(function(){ // the function executes on its own context
            this.count++; // NaN
            console.log(this.count); // NaN
        }, 300);
    }
}

obj.doSomethingLater(); // console prints "NaN", because the property "count" is not in the window scope
```

In this case, even though `doSomethingLater` is an object method, the `setTimeout` function is executed on its own context and not the object's context.
Before arrow functions, you would have to use `bind` to ensure the function executed in the proper scope.

Thanks to arrow functions, you can create a closure that retains the `this` value of the enclosing scope:

```js
var obj = {
    count : 10,
    doSomethingLater : function(){
        // because we are inside an object method, "this" binds to the object context
        setTimeout(() => {
            // makes use of "closures" by accessing the "this" value of the enclosing scope
            // Since the arrow function doesn't have its own binding and
            // setTimeout (as a function call) doesn't create a binding
            // itself, the enclosing scope (obj context) will be used
            this.count++;
            console.log(this.count);
        }, 300);
    }
}

obj.doSomethingLater();
```

## Explicit binding

### Using `call`

```js
function bar() {
  console.log(Object.prototype.toString.call(this));
}

bar.call(7);     // [object Number]
bar.call('foo'); // [object String]
bar.call(undefined); // [object global]
```

### Using `bind`

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

### Using `call` and `apply`

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

### Using `call` and `apply` with arguments

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

