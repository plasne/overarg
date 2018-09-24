
type identityFunction = (arg: any) => boolean;

const types = ["object", "boolean", "function", "number", "string", "symbol", "undefined"];

function getArg(offset: number, identity: identityFunction, ...args: any[]) {
    let index = 0;
    return args.find(arg => {
        let isMatch = false;
        try {
            isMatch = identity(arg);
        } catch (error) {
            // ignore errors; they won't be a match
        }
        if (isMatch) {
            if (index === offset) {
                return true;
            } else {
                index++;
                return false;
            }
        } else {
            return false;
        }
    });
}

function addToProtochain(a: any, list: string[]) {
    if (a.name) list.push(a.name);
    if (a.__proto__) addToProtochain(a.__proto__, list);
}

/**
 * This takes an object and returns an array of the names of the prototypes
 * it is composed of.
 */
export function getProtochain(a: any): string[] {
    const list: string[] = [];
    if (a.constructor) addToProtochain(a.constructor, list);
    return list;
}

/**
 * This tool helps with overloaded functions by allowing you to get the n-th argument
 * that matches by typeof or instanceof. There is also a special match for "array".
 * 
 * const argument = overarg<type>(offset? = 0, identifier, ...arguments);
 * 
 * Example 1: Find first string
 *   - const name = overarg<string>("string", ...arguments);
 * 
 * Example 2: Find second array
 *   - const arr2 = overarg<T[]>(1, "array", ...arguments);
 * 
 * Example 3: Find first RegExp
 *   - const pattern = overarg<RegExp>(RegExp, ...arguments);
 * 
 * Example 4: Find third object of type MyObject
 *   - const obj = overarg<MyObject>(2, MyObject, ...arguments);
 */
export function overarg<T>(typeOf: string, ...args: any[]): T | undefined;
export function overarg<T>(instanceOf: any, ...args: any[]): T | undefined;
export function overarg<T>(offset: number, typeOf: string, ...args: any[]): T | undefined;
export function overarg<T>(offset: number, instanceOf: any, ...args: any[]): T | undefined;
export function overarg<T>(a: any, b: any, ...args: any[]): T | undefined {
    if (typeof a === "number") {
        if (b === "array") {
            return getArg(a, (arg: any) => Array.isArray(arg), ...args);
        } else if (types.includes(b)) {
            return getArg(a, (arg: any) => typeof arg === b, ...args);
        } else if (typeof b === "string") {
            return getArg(a, (arg: any) => getProtochain(arg).includes(b), ...args);
        } else {
            return getArg(a, (arg: any) => arg instanceof b, ...args);
        }
    } else if (a === "array") {
        return getArg(0, (arg: any) => Array.isArray(arg), b, ...args);
    } else if (types.includes(a)) {
        return getArg(0, (arg: any) => typeof arg === a, b, ...args);
    } else if (typeof a === "string") {
        return getArg(0, (arg: any) => getProtochain(arg).includes(a), b, ...args);
    } else {
        return getArg(0, (arg: any) => arg instanceof a, b, ...args);
    }
}

/**
 * This tool helps with overloaded functions by allowing you to get the n-th argument
 * that can be passed to the provided function and return true. If evaluating the function
 * throws an exception, it will swallow the error and treat the evaluation as false.
 * 
 * const argument = overargFunc<type>(offset? = 0, (arg: any) => boolean, ...arguments);
 * 
 * Example 1:
 *   - const pet = overargFunc<dog | cat>(arg => arg.type === "dog" || arg.type === "cat", ...arguments);
 * 
 */
export function overargFunc<T>(offset: number, func: identityFunction, ...args: any[]): T | undefined;
export function overargFunc<T>(func: identityFunction, ...args: any[]): T | undefined;
export function overargFunc<T>(a: any, b: any, ...args: any[]): T | undefined {
    if (typeof a === "number") {
        return getArg(a, b, ...args);
    } else {
        return getArg(0, a, b, ...args);
    }
}