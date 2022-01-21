# Scope

> Variables declared by let have their scope in the block for which they are declared,
> as well as in any contained sub-blocks.In this way, let works very much like var.
> The main difference is that the scope of a var variable is the entire enclosing function.

## Question 1: `var`

```javascript
function varTest() {
	console.log(x);
	var x = 1;
	{
		var x = 2;
        	console.log(x);
        }
    	console.log(x);
}
```


```javascript
function varTest() {
	console.log(x);
	var x = 1;
	{
		var x = 2; // same variable!
        	console.log(x); // 2
        }
    	console.log(x); // 2
}
```

Answer:

## Question 2: `let`

```javascript
function letTest() {
	let x = 1;
	{
		let x = 2;
        	console.log(x);
        }
        console.log(x);
}
```

Answer:

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
    const func = () => console.log(letVar);
    let letVar = 3;
    func();
}
```

Answer:

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
	var a = 11;
    	let b = 22;
   	console.log(a);
   	console.log(b);
}

console.log(a);
console.log(b);
```

Answer:

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

## Question 5: `for` loops:

```javascript
function doSomething() {
	for (let i = 0; i < 5; i++) {
	// let defines variables in a block scope,
	// therefore every reference inside this block to variable i
	// will actually point to different variables (i.e., different pointers)
		setTimeout(function() {
			// this function will be scheduled with different i values
			// that will have a value of 0, 1, 2, 3, 4 respectively
			console.log(i);
		}, 100);
	}
}

doSomething();

// 0 1 2 3 4 5
```

```javascript
function doSomething() {
	for (var i = 0; i < 5; i++) {
	// var defines variables in a function scope,
	// therefore every reference inside this block to variable i
	// will actually point to the same variable (i.e., same pointer)
		setTimeout(function() {
			// this will always point to the same variable i,
			// that at the end of the for loop will have a value of 5
			console.log(i); // 5
		}, 100);
	}
}

doSomething();

// 5 5 5 5 5
```

