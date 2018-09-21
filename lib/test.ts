
import { overarg, overargFunc } from "./index";
import assert from "assert";
import "mocha";

describe("overarg", () => {

    it("should be undefined if no arguments were passed", () => {
        const test = (...args: any[]): void => {
            const string1 = overarg<string>("string", ...args);
            const number1 = overarg<number>("number", ...args);
            assert.strictEqual(string1, undefined);
            assert.strictEqual(number1, undefined);
        }
        test();
    });

    it("should work for 2 simple primitives", () => {
        const test = (...args: any[]): void => {
            const string1 = overarg<string>("string", ...args);
            const number1 = overarg<number>("number", ...args);
            assert.strictEqual(string1, "myString");
            assert.strictEqual(number1, 10);
        }
        test("myString", 10);
    });

    it("should work with an offset (2 strings)", () => {
        const test = (...args: any[]): void => {
            const string1 = overarg<string>("string", ...args);
            const string2 = overarg<string>(1, "string", ...args);
            assert.strictEqual(string1, "myString1");
            assert.strictEqual(string2, "myString2");
        }
        test("myString1", "myString2");
    });

    it("should work for 1 primitive and 1 instance", () => {
        const test = (...args: any[]): void => {
            const string1 = overarg<string>("string", ...args);
            const regexp1 = overarg<RegExp>(RegExp, ...args);
            assert.strictEqual(string1, "myString1");
            assert.ok(regexp1 instanceof RegExp);
        }
        test("myString1", /myRegExp/g);
    });

    it("should work for a single or array", () => {
        const test = (...args: any[]): any => {
            const operation = overarg<string>("string", ...args);
            if (operation) return operation;
            const operations = overarg<string[]>("array", ...args);
            if (operations) return operations;
        }
        const result1 = test("myString1");
        assert.ok(result1 === "myString1");
        assert.ok(typeof result1 === "string");
        const result2 = test(["myString1", "myString2"]);
        assert.ok(Array.isArray(result2));
        assert.ok(result2.includes("myString1") && result2.includes("myString2"));
    });

    it("should work for a function", () => {
        const test = (...args: any[]): void => {
            const func = overarg<(a: string) => string>("function", ...args);
            assert.ok(typeof func === "function");
        }
        test((a: string) => {
            return a;
        });
    });

    it("should work for a custom object", () => {
        class myClass {};
        const test = (...args: any[]): void => {
            const generic = overarg<myClass>("object", ...args);
            const specific = overarg<myClass>(myClass, ...args);
            assert.ok(generic instanceof myClass);
            assert.ok(specific instanceof myClass);
        }
        const myObject = new myClass();
        test(myObject);
    });

    it("should work for prototype chains", () => {
        class myGrandparent {};
        class myParent extends myGrandparent {};
        class myClass extends myParent {};
        const test = (...args: any[]): void => {
            const obj1 = overarg<myClass>("myClass", ...args);
            const obj2 = overarg<myClass>("myParent", ...args);
            const obj3 = overarg<myClass>("myGrandparent", ...args);
            const obj4 = overarg<myClass>("object", ...args);
            assert.ok(obj1 instanceof myClass);
            assert.ok(obj2 instanceof myClass);
            assert.ok(obj3 instanceof myClass);
            assert.ok(obj4 instanceof myClass);
        }
        const myObject = new myClass();
        test(myObject);
    });

    it("should work using a function to resolve", () => {
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
    });


});