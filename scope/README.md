# Scope

> Variables declared by let have their scope in the block for which they are declared,
> as well as in any contained sub-blocks.In this way, let works very much like var.
> The main difference is that the scope of a var variable is the entire enclosing function.

## Question 1: `var`

```javascript
function varTest() {
	console.log(x) // undefined (hoisting)
	var x = 1;
	{
		var x = 2; // same variable!
        console.log(x); // 2
    }
    console.log(x); // 2
}
```

## Question 2: `let`

```javascript
function letTest() {
	let x = 1;
	{
		let x = 2; // different variable
        console.log(x); // 2
    }
    console.log(x) // 1;
}
```

## Question 3: `let` Temporal Dead Zone

```javascript
{
    // TDZ starts at beginning of scope
    const func = () => console.log(letVar); // OK

    // Within the TDZ letVar access throws `ReferenceError`

    let letVar = 3; // End of TDZ (for letVar)
    func(); // Called outside TDZ!
}

```

## Question 4: `var` vs `let`

```javascript
var a = 1;
var b = 2;

if (a == 1) {
	var a = 11; // the scope is global, it mutates `a`
    let b = 22; // the scope is inside the if-block
    console.log(a); // 11
    console.log(b); // 22
}

console.log(a); // 11
console.log(b); // 2
```

