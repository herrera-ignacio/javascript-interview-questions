# Shallow vs deep copy

- [Shallow vs deep copy](#shallow-vs-deep-copy)
  - [Question 1: How would you explain what a shallow copy is?](#question-1-how-would-you-explain-what-a-shallow-copy-is)
  - [Question 2: How would you make a deep copy in JavaScript?](#question-2-how-would-you-make-a-deep-copy-in-javascript)

## Question 1: How would you explain what a shallow copy is?

A shallow copy creates a new object but when the original object has mutable values, the mutable values are copied by reference.

Either the spread operator, `Object.assign` or `Array.from` can be used to create a shallow copy.

```js
const original = { a: { x: 1, y: 2 }};
const shallow = { ...original };
```

In this case, `original.a` and `shallow.a` point to the same object.

```js
shallow.a.x = 3;
console.log(original.a.x); // 3
console.log(shallow.a.x); // 3
```

## Question 2: How would you make a deep copy in JavaScript?

A deep copy creates a new object and copies all the values (not their references) of the original object.

You can use a combination of `JSON.parse` and `JSON.stringify` to create a deep copy. Latest versions of Node and browsers also support `structuredClone`.

Another valid answer would be to use a library like `lodash` or `immer`.

```js
const original = { a: { x: 1, y: 2 }};
const deep = JSON.parse(JSON.stringify(original));
```

In this case, `original.a` and `deep.a` point to different objects.

```js
original.a.x = 3;
console.log(original.a.x); // 3
console.log(deep.a.x); // 1
```

Alternatively, using `structuredClone`:

```js
const original = { a: { x: 1, y: 2 }};
const deep = structuredClone(original);
```

In this case, `original.a` and `deep.a` point to different objects.
