"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var assert_1 = __importDefault(require("assert"));
require("mocha");
describe("overarg", function () {
    it("should be undefined if no arguments were passed", function () {
        var test = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var string1 = index_1.overarg.apply(void 0, ["string"].concat(args));
            var number1 = index_1.overarg.apply(void 0, ["number"].concat(args));
            assert_1.default.strictEqual(string1, undefined);
            assert_1.default.strictEqual(number1, undefined);
        };
        test();
    });
    it("should work for 2 simple primitives", function () {
        var test = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var string1 = index_1.overarg.apply(void 0, ["string"].concat(args));
            var number1 = index_1.overarg.apply(void 0, ["number"].concat(args));
            assert_1.default.strictEqual(string1, "myString");
            assert_1.default.strictEqual(number1, 10);
        };
        test("myString", 10);
    });
    it("should work with an offset (2 strings)", function () {
        var test = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var string1 = index_1.overarg.apply(void 0, ["string"].concat(args));
            var string2 = index_1.overarg.apply(void 0, [1, "string"].concat(args));
            assert_1.default.strictEqual(string1, "myString1");
            assert_1.default.strictEqual(string2, "myString2");
        };
        test("myString1", "myString2");
    });
    it("should work for 1 primitive and 1 instance", function () {
        var test = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var string1 = index_1.overarg.apply(void 0, ["string"].concat(args));
            var regexp1 = index_1.overarg.apply(void 0, [RegExp].concat(args));
            assert_1.default.strictEqual(string1, "myString1");
            assert_1.default.ok(regexp1 instanceof RegExp);
        };
        test("myString1", /myRegExp/g);
    });
    it("should work for a single or array", function () {
        var test = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var operation = index_1.overarg.apply(void 0, ["string"].concat(args));
            if (operation)
                return operation;
            var operations = index_1.overarg.apply(void 0, ["array"].concat(args));
            if (operations)
                return operations;
        };
        var result1 = test("myString1");
        assert_1.default.ok(result1 === "myString1");
        assert_1.default.ok(typeof result1 === "string");
        var result2 = test(["myString1", "myString2"]);
        assert_1.default.ok(Array.isArray(result2));
        assert_1.default.ok(result2.includes("myString1") && result2.includes("myString2"));
    });
    it("should work for a function", function () {
        var test = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var func = index_1.overarg.apply(void 0, ["function"].concat(args));
            assert_1.default.ok(typeof func === "function");
        };
        test(function (a) {
            return a;
        });
    });
    it("should work for a custom object", function () {
        var myClass = /** @class */ (function () {
            function myClass() {
            }
            return myClass;
        }());
        ;
        var test = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var generic = index_1.overarg.apply(void 0, ["object"].concat(args));
            var specific = index_1.overarg.apply(void 0, [myClass].concat(args));
            assert_1.default.ok(generic instanceof myClass);
            assert_1.default.ok(specific instanceof myClass);
        };
        var myObject = new myClass();
        test(myObject);
    });
    it("should work for prototype chains", function () {
        var myGrandparent = /** @class */ (function () {
            function myGrandparent() {
            }
            return myGrandparent;
        }());
        ;
        var myParent = /** @class */ (function (_super) {
            __extends(myParent, _super);
            function myParent() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return myParent;
        }(myGrandparent));
        ;
        var myClass = /** @class */ (function (_super) {
            __extends(myClass, _super);
            function myClass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return myClass;
        }(myParent));
        ;
        var test = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var obj1 = index_1.overarg.apply(void 0, ["myClass"].concat(args));
            var obj2 = index_1.overarg.apply(void 0, ["myParent"].concat(args));
            var obj3 = index_1.overarg.apply(void 0, ["myGrandparent"].concat(args));
            var obj4 = index_1.overarg.apply(void 0, ["object"].concat(args));
            assert_1.default.ok(obj1 instanceof myClass);
            assert_1.default.ok(obj2 instanceof myClass);
            assert_1.default.ok(obj3 instanceof myClass);
            assert_1.default.ok(obj4 instanceof myClass);
        };
        var myObject = new myClass();
        test(myObject);
    });
    it("should work using a function to resolve", function () {
        var test = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return index_1.overargFunc.apply(void 0, [function (arg) { return arg.type === "dog"; }].concat(args));
        };
        var monkey = { type: "monkey" };
        var result1 = test(monkey);
        assert_1.default.strictEqual(result1, undefined);
        var dog = { type: "dog" };
        var result2 = test(dog);
        assert_1.default.strictEqual(result2, dog);
    });
});
