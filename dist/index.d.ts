declare type identityFunction = (arg: any) => boolean;
/**
 * This takes an object and returns an array of the names of the prototypes
 * it is composed of.
 */
export declare function getProtochain(a: any): string[];
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
export declare function overarg<T>(typeOf: string, ...args: any[]): T | undefined;
export declare function overarg<T>(instanceOf: any, ...args: any[]): T | undefined;
export declare function overarg<T>(offset: number, typeOf: string, ...args: any[]): T | undefined;
export declare function overarg<T>(offset: number, instanceOf: any, ...args: any[]): T | undefined;
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
export declare function overargFunc<T>(offset: number, func: identityFunction, ...args: any[]): T | undefined;
export declare function overargFunc<T>(func: identityFunction, ...args: any[]): T | undefined;
export {};
