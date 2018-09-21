"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types = ["object", "boolean", "function", "number", "string", "symbol", "undefined"];
function getArg(offset, identity) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var index = 0;
    return args.find(function (arg) {
        var isMatch = false;
        try {
            isMatch = identity(arg);
        }
        catch (error) {
            // ignore errors; they won't be a match
        }
        if (isMatch) {
            if (index === offset) {
                return true;
            }
            else {
                index++;
                return false;
            }
        }
        else {
            return false;
        }
    });
}
function addToProtochain(a, list) {
    if (a.name)
        list.push(a.name);
    if (a.__proto__)
        addToProtochain(a.__proto__, list);
}
function getProtochain(a) {
    var list = [];
    if (a.constructor)
        addToProtochain(a.constructor, list);
    return list;
}
exports.getProtochain = getProtochain;
function overarg(a, b) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (typeof a === "number") {
        if (b === "array") {
            return getArg.apply(void 0, [a, function (arg) { return Array.isArray(arg); }].concat(args));
        }
        else if (types.includes(b)) {
            return getArg.apply(void 0, [a, function (arg) { return typeof arg === b; }].concat(args));
        }
        else if (typeof b === "string") {
            return getArg.apply(void 0, [a, function (arg) { return getProtochain(arg).includes(b); }].concat(args));
        }
        else {
            return getArg.apply(void 0, [a, function (arg) { return arg instanceof b; }].concat(args));
        }
    }
    else if (a === "array") {
        return getArg.apply(void 0, [0, function (arg) { return Array.isArray(arg); }, b].concat(args));
    }
    else if (types.includes(a)) {
        return getArg.apply(void 0, [0, function (arg) { return typeof arg === a; }, b].concat(args));
    }
    else if (typeof a === "string") {
        return getArg.apply(void 0, [0, function (arg) { return getProtochain(arg).includes(a); }, b].concat(args));
    }
    else {
        return getArg.apply(void 0, [0, function (arg) { return arg instanceof a; }, b].concat(args));
    }
}
exports.overarg = overarg;
function overargFunc(a, b) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (typeof a === "number") {
        return getArg.apply(void 0, [a, b].concat(args));
    }
    else {
        return getArg.apply(void 0, [0, a, b].concat(args));
    }
}
exports.overargFunc = overargFunc;
