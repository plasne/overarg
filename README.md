
# overarg

A tool to help with returning typed arguments from overloaded functions in TypeScript.

## What it does

Consider an overloaded method that can take 0-3 arguments in any combination that looks like this...

```typescript
public test(name: string): void;
public test(age: number): void;
public test(dob: Date): void;
public test(name: string, age: number): void;
public test(name: string, dob: Date): void;
public test(age: number, dob: Date): void;
public test(name: string, age: number, dob: Date): void;
public test(): void { }
```

You might have to write a bunch of logic to figure out what parameters you have, or you could do this inside the function:

```typescript
const name = overarg<string>("string", ...arguments);
const age = overarg<number>("number", ...arguments);
const dob = overarg<Date>("object", ...arguments);
```

Each variables will be strong-typed or undefined, easy as can be. You can even have multiple arguments of the same type and specify an offset so for instance:

```typescript
// 1st string provided is firstName
const firstName = overarg<string>(0, "string", ...arguments);
// 2nd string provided is lastName
const lastName = overarg<string>(1, "string", ...arguments);
```

## Installation

```sh
npm install --save overarg
```

## Usage

As shown in the example above, define all your overloads, but the actual function signature doesn't need any arguments.

```typescript
// include in your project
import { overarg, overargFunc } from "overarg";

// offset defaults to 0, so the first match for the identifier will be used
const variable1 = overarg<type>(identifier, ...arguments);

// specify the offset as a number (indexed from 0) to get later matches (ex. offset = 1, gets the second match)
const variable2 = overarg<type>(offset, identifier, ...arguments);
```

*type* is the return desired return type, ex. *string* or *RegExp*, but the actual return overarg() will be that type | undefined (in case it couldn't match). This also allows you to set default values easily:

```typescript
// sets variable1 to the value of the first argument that was a number or 100 if there wasn't one
const variable1 = overarg<number>("number", ...arguments) || 100;
```

## Identifiers

The identifiers in this list are tested in this order:

* "array" - Will match an argument if it is an Array.

* "object", "boolean", "function", "number", "string", "symbol", "undefined" - Will match an argument if typeof returns the specified primitive JavaScript type.

* string - Will match an argument that has the specified name in its prototype chain. For example, when MyClass extends MyParent, you can specify "MyClass" or "MyParent" as the identifier.

* object - Will match an argument that is an instanceof the specified object. For example, /myRegExp/g is an instanceof RegExp.

It is important to understand what typeof and instanceof do, and how they are resolved by JavaScript, some odd examples:

```typescript
typeof new Date(); // is object
typeof null;       // is object
typeof undefined;  // is undefined
```

## Functions

When the above identifiers are not enough, you can use a Function to find the argument, by using overargFunc():

```typescript
const variable1 = overargFunc<type>((arg: any): boolean => {}, ...arguments);
```

An example:

```typescript
// test case showing monkey is not matched, but dog is
interface animal {}
interface monkey extends animal {
    type: "monkey"
}
interface dog extends animal {
    type: "dog"
}
const test = (...args: any[]): animal | undefined => {
    return overargFunc<animal>(arg => arg.type === "dog", ...args);
}
const monkey: monkey = { type: "monkey"};
const result1 = test(monkey);
assert.strictEqual(result1, undefined);
const dog: dog = { type: "dog"};
const result2 = test(dog);
assert.strictEqual(result2, dog);
```

## Arrow Functions

Please note that JavaScript Arrow Functions do not have their own *arguments* [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), but you can use ...args: any[] in TypeScript even on an Arrow Function and it will generate proper JavaScript.

In that case, you should pass ...args instead of ...arguments.

```typescript
const test = (...args: any[]): void => {
    const variable1 = overarg<string>("string", ...args);
}
test("testing");
```

## Real-World Example

```typescript
// list the blobs via a streaming pattern
public list<Out = azs.BlobService.BlobResult>(): ReadableStream<azs.BlobService.BlobResult, Out>;
public list<Out = azs.BlobService.BlobResult>(prefix: string): ReadableStream<azs.BlobService.BlobResult, Out>;
public list<Out = azs.BlobService.BlobResult>(transform: StreamTransform<azs.BlobService.BlobResult, Out>): ReadableStream<azs.BlobService.BlobResult, Out>;
public list<Out = azs.BlobService.BlobResult>(options: StreamOptions<azs.BlobService.BlobResult, Out>): ReadableStream<azs.BlobService.BlobResult, Out>;
public list<Out = azs.BlobService.BlobResult>(prefix: string, options: StreamOptions<azs.BlobService.BlobResult, Out>): ReadableStream<azs.BlobService.BlobResult, Out>;
public list<Out = azs.BlobService.BlobResult>(prefix: string, transform: StreamTransform<azs.BlobService.BlobResult, Out>): ReadableStream<azs.BlobService.BlobResult, Out>;
public list<Out = azs.BlobService.BlobResult>(transform: StreamTransform<azs.BlobService.BlobResult, Out>, options: StreamOptions<azs.BlobService.BlobResult, Out>): ReadableStream<azs.BlobService.BlobResult, Out>;
public list<Out = azs.BlobService.BlobResult>(prefix: string, transform: StreamTransform<azs.BlobService.BlobResult, Out>, options: StreamOptions<azs.BlobService.BlobResult, Out>): ReadableStream<azs.BlobService.BlobResult, Out>;
public list<Out = azs.BlobService.BlobResult>(): ReadableStream<azs.BlobService.BlobResult, Out> {

    // get arguments
    let prefix: string | undefined = undefined;
    let out_options: StreamOptions<azs.BlobService.BlobResult, T> = {};
    if (arguments[0] && typeof arguments[0] === "object") out_options = arguments[0];
    if (arguments[1] && typeof arguments[1] === "object") out_options = arguments[1];
    if (arguments[2] && typeof arguments[2] === "object") out_options = arguments[2];
    if (arguments[0] && typeof arguments[0] === "string") prefix = arguments[0];
    if (arguments[0] && typeof arguments[0] === "function") out_options.transform = arguments[0];
    if (arguments[1] && typeof arguments[1] === "function") out_options.transform = arguments[1];

}
```

This module addresses the "get arguments" section, making it look like this:

```typescript
    // get arguments
    const prefix = overarg<string>("string", ...arguments);
    const transform = overarg<StreamTransform<azs.BlobService.BlobResult, Out>>("function", ...arguments);
    const options = overarg<StreamOptions<azs.BlobService.BlobResult, Out>>("object", ...arguments) || {};
    if (transform) options.transform = transform;
```