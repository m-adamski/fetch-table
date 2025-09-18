(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.FetchTable = factory());
})(this, (function () { 'use strict';

    /** A special constant with type `never` */
    function $constructor(name, initializer, params) {
        function init(inst, def) {
            var _a;
            Object.defineProperty(inst, "_zod", {
                value: inst._zod ?? {},
                enumerable: false,
            });
            (_a = inst._zod).traits ?? (_a.traits = new Set());
            inst._zod.traits.add(name);
            initializer(inst, def);
            // support prototype modifications
            for (const k in _.prototype) {
                if (!(k in inst))
                    Object.defineProperty(inst, k, { value: _.prototype[k].bind(inst) });
            }
            inst._zod.constr = _;
            inst._zod.def = def;
        }
        // doesn't work if Parent has a constructor with arguments
        const Parent = params?.Parent ?? Object;
        class Definition extends Parent {
        }
        Object.defineProperty(Definition, "name", { value: name });
        function _(def) {
            var _a;
            const inst = params?.Parent ? new Definition() : this;
            init(inst, def);
            (_a = inst._zod).deferred ?? (_a.deferred = []);
            for (const fn of inst._zod.deferred) {
                fn();
            }
            return inst;
        }
        Object.defineProperty(_, "init", { value: init });
        Object.defineProperty(_, Symbol.hasInstance, {
            value: (inst) => {
                if (params?.Parent && inst instanceof params.Parent)
                    return true;
                return inst?._zod?.traits?.has(name);
            },
        });
        Object.defineProperty(_, "name", { value: name });
        return _;
    }
    class $ZodAsyncError extends Error {
        constructor() {
            super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
        }
    }
    const globalConfig = {};
    function config(newConfig) {
        return globalConfig;
    }

    // functions
    function getEnumValues(entries) {
        const numericValues = Object.values(entries).filter((v) => typeof v === "number");
        const values = Object.entries(entries)
            .filter(([k, _]) => numericValues.indexOf(+k) === -1)
            .map(([_, v]) => v);
        return values;
    }
    function jsonStringifyReplacer(_, value) {
        if (typeof value === "bigint")
            return value.toString();
        return value;
    }
    function cached(getter) {
        return {
            get value() {
                {
                    const value = getter();
                    Object.defineProperty(this, "value", { value });
                    return value;
                }
            },
        };
    }
    function cleanRegex(source) {
        const start = source.startsWith("^") ? 1 : 0;
        const end = source.endsWith("$") ? source.length - 1 : source.length;
        return source.slice(start, end);
    }
    const EVALUATING = Symbol("evaluating");
    function defineLazy(object, key, getter) {
        let value = undefined;
        Object.defineProperty(object, key, {
            get() {
                if (value === EVALUATING) {
                    // Circular reference detected, return undefined to break the cycle
                    return undefined;
                }
                if (value === undefined) {
                    value = EVALUATING;
                    value = getter();
                }
                return value;
            },
            set(v) {
                Object.defineProperty(object, key, {
                    value: v,
                    // configurable: true,
                });
                // object[key] = v;
            },
            configurable: true,
        });
    }
    function assignProp(target, prop, value) {
        Object.defineProperty(target, prop, {
            value,
            writable: true,
            enumerable: true,
            configurable: true,
        });
    }
    const captureStackTrace = ("captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => { });
    function isObject(data) {
        return typeof data === "object" && data !== null && !Array.isArray(data);
    }
    function isPlainObject(o) {
        if (isObject(o) === false)
            return false;
        // modified constructor
        const ctor = o.constructor;
        if (ctor === undefined)
            return true;
        // modified prototype
        const prot = ctor.prototype;
        if (isObject(prot) === false)
            return false;
        // ctor doesn't have static `isPrototypeOf`
        if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
            return false;
        }
        return true;
    }
    function shallowClone(o) {
        if (isPlainObject(o))
            return { ...o };
        if (Array.isArray(o))
            return [...o];
        return o;
    }
    const propertyKeyTypes = new Set(["string", "number", "symbol"]);
    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    // zod-specific utils
    function clone(inst, def, params) {
        const cl = new inst._zod.constr(def ?? inst._zod.def);
        if (!def || params?.parent)
            cl._zod.parent = inst;
        return cl;
    }
    function normalizeParams(_params) {
        return {};
    }
    function optionalKeys(shape) {
        return Object.keys(shape).filter((k) => {
            return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
        });
    }
    // invalid_type | too_big | too_small | invalid_format | not_multiple_of | unrecognized_keys | invalid_union | invalid_key | invalid_element | invalid_value | custom
    function aborted(x, startIndex = 0) {
        if (x.aborted === true)
            return true;
        for (let i = startIndex; i < x.issues.length; i++) {
            if (x.issues[i]?.continue !== true) {
                return true;
            }
        }
        return false;
    }
    function prefixIssues(path, issues) {
        return issues.map((iss) => {
            var _a;
            (_a = iss).path ?? (_a.path = []);
            iss.path.unshift(path);
            return iss;
        });
    }
    function unwrapMessage(message) {
        return typeof message === "string" ? message : message?.message;
    }
    function finalizeIssue(iss, ctx, config) {
        const full = { ...iss, path: iss.path ?? [] };
        // for backwards compatibility
        if (!iss.message) {
            const message = unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ??
                unwrapMessage(ctx?.error?.(iss)) ??
                unwrapMessage(config.customError?.(iss)) ??
                unwrapMessage(config.localeError?.(iss)) ??
                "Invalid input";
            full.message = message;
        }
        // delete (full as any).def;
        delete full.inst;
        delete full.continue;
        if (!ctx?.reportInput) {
            delete full.input;
        }
        return full;
    }

    const initializer = (inst, def) => {
        inst.name = "$ZodError";
        Object.defineProperty(inst, "_zod", {
            value: inst._zod,
            enumerable: false,
        });
        Object.defineProperty(inst, "issues", {
            value: def,
            enumerable: false,
        });
        inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
        Object.defineProperty(inst, "toString", {
            value: () => inst.message,
            enumerable: false,
        });
    };
    const $ZodError = $constructor("$ZodError", initializer);
    const $ZodRealError = $constructor("$ZodError", initializer, { Parent: Error });

    const _parse = (_Err) => (schema, value, _ctx, _params) => {
        const ctx = _ctx ? Object.assign(_ctx, { async: false }) : { async: false };
        const result = schema._zod.run({ value, issues: [] }, ctx);
        if (result instanceof Promise) {
            throw new $ZodAsyncError();
        }
        if (result.issues.length) {
            const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
            captureStackTrace(e, _params?.callee);
            throw e;
        }
        return result.value;
    };
    const parse = /* @__PURE__*/ _parse($ZodRealError);
    const _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
        const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
        let result = schema._zod.run({ value, issues: [] }, ctx);
        if (result instanceof Promise)
            result = await result;
        if (result.issues.length) {
            const e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
            captureStackTrace(e, params?.callee);
            throw e;
        }
        return result.value;
    };
    const parseAsync = /* @__PURE__*/ _parseAsync($ZodRealError);
    const _safeParse = (_Err) => (schema, value, _ctx) => {
        const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
        const result = schema._zod.run({ value, issues: [] }, ctx);
        if (result instanceof Promise) {
            throw new $ZodAsyncError();
        }
        return result.issues.length
            ? {
                success: false,
                error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config()))),
            }
            : { success: true, data: result.value };
    };
    const safeParse = /* @__PURE__*/ _safeParse($ZodRealError);
    const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
        const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
        let result = schema._zod.run({ value, issues: [] }, ctx);
        if (result instanceof Promise)
            result = await result;
        return result.issues.length
            ? {
                success: false,
                error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config()))),
            }
            : { success: true, data: result.value };
    };
    const safeParseAsync = /* @__PURE__*/ _safeParseAsync($ZodRealError);

    const string$1 = (params) => {
        const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
        return new RegExp(`^${regex}$`);
    };
    const number$1 = /^-?\d+(?:\.\d+)?/;
    const boolean$1 = /^(?:true|false)$/i;

    const version = {
        major: 4,
        minor: 1,
        patch: 9,
    };

    const $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
        var _a;
        inst ?? (inst = {});
        inst._zod.def = def; // set _def property
        inst._zod.bag = inst._zod.bag || {}; // initialize _bag object
        inst._zod.version = version;
        const checks = [...(inst._zod.def.checks ?? [])];
        // if inst is itself a checks.$ZodCheck, run it as a check
        if (inst._zod.traits.has("$ZodCheck")) {
            checks.unshift(inst);
        }
        for (const ch of checks) {
            for (const fn of ch._zod.onattach) {
                fn(inst);
            }
        }
        if (checks.length === 0) {
            // deferred initializer
            // inst._zod.parse is not yet defined
            (_a = inst._zod).deferred ?? (_a.deferred = []);
            inst._zod.deferred?.push(() => {
                inst._zod.run = inst._zod.parse;
            });
        }
        else {
            const runChecks = (payload, checks, ctx) => {
                let isAborted = aborted(payload);
                let asyncResult;
                for (const ch of checks) {
                    if (ch._zod.def.when) {
                        const shouldRun = ch._zod.def.when(payload);
                        if (!shouldRun)
                            continue;
                    }
                    else if (isAborted) {
                        continue;
                    }
                    const currLen = payload.issues.length;
                    const _ = ch._zod.check(payload);
                    if (_ instanceof Promise && ctx?.async === false) {
                        throw new $ZodAsyncError();
                    }
                    if (asyncResult || _ instanceof Promise) {
                        asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
                            await _;
                            const nextLen = payload.issues.length;
                            if (nextLen === currLen)
                                return;
                            if (!isAborted)
                                isAborted = aborted(payload, currLen);
                        });
                    }
                    else {
                        const nextLen = payload.issues.length;
                        if (nextLen === currLen)
                            continue;
                        if (!isAborted)
                            isAborted = aborted(payload, currLen);
                    }
                }
                if (asyncResult) {
                    return asyncResult.then(() => {
                        return payload;
                    });
                }
                return payload;
            };
            // const handleChecksResult = (
            //   checkResult: ParsePayload,
            //   originalResult: ParsePayload,
            //   ctx: ParseContextInternal
            // ): util.MaybeAsync<ParsePayload> => {
            //   // if the checks mutated the value && there are no issues, re-parse the result
            //   if (checkResult.value !== originalResult.value && !checkResult.issues.length)
            //     return inst._zod.parse(checkResult, ctx);
            //   return originalResult;
            // };
            const handleCanaryResult = (canary, payload, ctx) => {
                // abort if the canary is aborted
                if (aborted(canary)) {
                    canary.aborted = true;
                    return canary;
                }
                // run checks first, then
                const checkResult = runChecks(payload, checks, ctx);
                if (checkResult instanceof Promise) {
                    if (ctx.async === false)
                        throw new $ZodAsyncError();
                    return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
                }
                return inst._zod.parse(checkResult, ctx);
            };
            inst._zod.run = (payload, ctx) => {
                if (ctx.skipChecks) {
                    return inst._zod.parse(payload, ctx);
                }
                if (ctx.direction === "backward") {
                    // run canary
                    // initial pass (no checks)
                    const canary = inst._zod.parse({ value: payload.value, issues: [] }, { ...ctx, skipChecks: true });
                    if (canary instanceof Promise) {
                        return canary.then((canary) => {
                            return handleCanaryResult(canary, payload, ctx);
                        });
                    }
                    return handleCanaryResult(canary, payload, ctx);
                }
                // forward
                const result = inst._zod.parse(payload, ctx);
                if (result instanceof Promise) {
                    if (ctx.async === false)
                        throw new $ZodAsyncError();
                    return result.then((result) => runChecks(result, checks, ctx));
                }
                return runChecks(result, checks, ctx);
            };
        }
        inst["~standard"] = {
            validate: (value) => {
                try {
                    const r = safeParse(inst, value);
                    return r.success ? { value: r.data } : { issues: r.error?.issues };
                }
                catch (_) {
                    return safeParseAsync(inst, value).then((r) => (r.success ? { value: r.data } : { issues: r.error?.issues }));
                }
            },
            vendor: "zod",
            version: 1,
        };
    });
    const $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
        $ZodType.init(inst, def);
        inst._zod.pattern = [...(inst?._zod.bag?.patterns ?? [])].pop() ?? string$1(inst._zod.bag);
        inst._zod.parse = (payload, _) => {
            if (def.coerce)
                try {
                    payload.value = String(payload.value);
                }
                catch (_) { }
            if (typeof payload.value === "string")
                return payload;
            payload.issues.push({
                expected: "string",
                code: "invalid_type",
                input: payload.value,
                inst,
            });
            return payload;
        };
    });
    const $ZodNumber = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
        $ZodType.init(inst, def);
        inst._zod.pattern = inst._zod.bag.pattern ?? number$1;
        inst._zod.parse = (payload, _ctx) => {
            if (def.coerce)
                try {
                    payload.value = Number(payload.value);
                }
                catch (_) { }
            const input = payload.value;
            if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) {
                return payload;
            }
            const received = typeof input === "number"
                ? Number.isNaN(input)
                    ? "NaN"
                    : !Number.isFinite(input)
                        ? "Infinity"
                        : undefined
                : undefined;
            payload.issues.push({
                expected: "number",
                code: "invalid_type",
                input,
                inst,
                ...(received ? { received } : {}),
            });
            return payload;
        };
    });
    const $ZodBoolean = /*@__PURE__*/ $constructor("$ZodBoolean", (inst, def) => {
        $ZodType.init(inst, def);
        inst._zod.pattern = boolean$1;
        inst._zod.parse = (payload, _ctx) => {
            if (def.coerce)
                try {
                    payload.value = Boolean(payload.value);
                }
                catch (_) { }
            const input = payload.value;
            if (typeof input === "boolean")
                return payload;
            payload.issues.push({
                expected: "boolean",
                code: "invalid_type",
                input,
                inst,
            });
            return payload;
        };
    });
    function handleArrayResult(result, final, index) {
        if (result.issues.length) {
            final.issues.push(...prefixIssues(index, result.issues));
        }
        final.value[index] = result.value;
    }
    const $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
        $ZodType.init(inst, def);
        inst._zod.parse = (payload, ctx) => {
            const input = payload.value;
            if (!Array.isArray(input)) {
                payload.issues.push({
                    expected: "array",
                    code: "invalid_type",
                    input,
                    inst,
                });
                return payload;
            }
            payload.value = Array(input.length);
            const proms = [];
            for (let i = 0; i < input.length; i++) {
                const item = input[i];
                const result = def.element._zod.run({
                    value: item,
                    issues: [],
                }, ctx);
                if (result instanceof Promise) {
                    proms.push(result.then((result) => handleArrayResult(result, payload, i)));
                }
                else {
                    handleArrayResult(result, payload, i);
                }
            }
            if (proms.length) {
                return Promise.all(proms).then(() => payload);
            }
            return payload; //handleArrayResultsAsync(parseResults, final);
        };
    });
    function handlePropertyResult(result, final, key, input) {
        if (result.issues.length) {
            final.issues.push(...prefixIssues(key, result.issues));
        }
        if (result.value === undefined) {
            if (key in input) {
                final.value[key] = undefined;
            }
        }
        else {
            final.value[key] = result.value;
        }
    }
    function normalizeDef(def) {
        const keys = Object.keys(def.shape);
        for (const k of keys) {
            if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) {
                throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
            }
        }
        const okeys = optionalKeys(def.shape);
        return {
            ...def,
            keys,
            keySet: new Set(keys),
            numKeys: keys.length,
            optionalKeys: new Set(okeys),
        };
    }
    function handleCatchall(proms, input, payload, ctx, def, inst) {
        const unrecognized = [];
        // iterate over input keys
        const keySet = def.keySet;
        const _catchall = def.catchall._zod;
        const t = _catchall.def.type;
        for (const key of Object.keys(input)) {
            if (keySet.has(key))
                continue;
            if (t === "never") {
                unrecognized.push(key);
                continue;
            }
            const r = _catchall.run({ value: input[key], issues: [] }, ctx);
            if (r instanceof Promise) {
                proms.push(r.then((r) => handlePropertyResult(r, payload, key, input)));
            }
            else {
                handlePropertyResult(r, payload, key, input);
            }
        }
        if (unrecognized.length) {
            payload.issues.push({
                code: "unrecognized_keys",
                keys: unrecognized,
                input,
                inst,
            });
        }
        if (!proms.length)
            return payload;
        return Promise.all(proms).then(() => {
            return payload;
        });
    }
    const $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
        // requires cast because technically $ZodObject doesn't extend
        $ZodType.init(inst, def);
        const _normalized = cached(() => normalizeDef(def));
        defineLazy(inst._zod, "propValues", () => {
            const shape = def.shape;
            const propValues = {};
            for (const key in shape) {
                const field = shape[key]._zod;
                if (field.values) {
                    propValues[key] ?? (propValues[key] = new Set());
                    for (const v of field.values)
                        propValues[key].add(v);
                }
            }
            return propValues;
        });
        const isObject$1 = isObject;
        const catchall = def.catchall;
        let value;
        inst._zod.parse = (payload, ctx) => {
            value ?? (value = _normalized.value);
            const input = payload.value;
            if (!isObject$1(input)) {
                payload.issues.push({
                    expected: "object",
                    code: "invalid_type",
                    input,
                    inst,
                });
                return payload;
            }
            payload.value = {};
            const proms = [];
            const shape = value.shape;
            for (const key of value.keys) {
                const el = shape[key];
                const r = el._zod.run({ value: input[key], issues: [] }, ctx);
                if (r instanceof Promise) {
                    proms.push(r.then((r) => handlePropertyResult(r, payload, key, input)));
                }
                else {
                    handlePropertyResult(r, payload, key, input);
                }
            }
            if (!catchall) {
                return proms.length ? Promise.all(proms).then(() => payload) : payload;
            }
            return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
        };
    });
    const $ZodRecord = /*@__PURE__*/ $constructor("$ZodRecord", (inst, def) => {
        $ZodType.init(inst, def);
        inst._zod.parse = (payload, ctx) => {
            const input = payload.value;
            if (!isPlainObject(input)) {
                payload.issues.push({
                    expected: "record",
                    code: "invalid_type",
                    input,
                    inst,
                });
                return payload;
            }
            const proms = [];
            if (def.keyType._zod.values) {
                const values = def.keyType._zod.values;
                payload.value = {};
                for (const key of values) {
                    if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
                        const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
                        if (result instanceof Promise) {
                            proms.push(result.then((result) => {
                                if (result.issues.length) {
                                    payload.issues.push(...prefixIssues(key, result.issues));
                                }
                                payload.value[key] = result.value;
                            }));
                        }
                        else {
                            if (result.issues.length) {
                                payload.issues.push(...prefixIssues(key, result.issues));
                            }
                            payload.value[key] = result.value;
                        }
                    }
                }
                let unrecognized;
                for (const key in input) {
                    if (!values.has(key)) {
                        unrecognized = unrecognized ?? [];
                        unrecognized.push(key);
                    }
                }
                if (unrecognized && unrecognized.length > 0) {
                    payload.issues.push({
                        code: "unrecognized_keys",
                        input,
                        inst,
                        keys: unrecognized,
                    });
                }
            }
            else {
                payload.value = {};
                for (const key of Reflect.ownKeys(input)) {
                    if (key === "__proto__")
                        continue;
                    const keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
                    if (keyResult instanceof Promise) {
                        throw new Error("Async schemas not supported in object keys currently");
                    }
                    if (keyResult.issues.length) {
                        payload.issues.push({
                            code: "invalid_key",
                            origin: "record",
                            issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
                            input: key,
                            path: [key],
                            inst,
                        });
                        payload.value[keyResult.value] = keyResult.value;
                        continue;
                    }
                    const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
                    if (result instanceof Promise) {
                        proms.push(result.then((result) => {
                            if (result.issues.length) {
                                payload.issues.push(...prefixIssues(key, result.issues));
                            }
                            payload.value[keyResult.value] = result.value;
                        }));
                    }
                    else {
                        if (result.issues.length) {
                            payload.issues.push(...prefixIssues(key, result.issues));
                        }
                        payload.value[keyResult.value] = result.value;
                    }
                }
            }
            if (proms.length) {
                return Promise.all(proms).then(() => payload);
            }
            return payload;
        };
    });
    const $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
        $ZodType.init(inst, def);
        const values = getEnumValues(def.entries);
        const valuesSet = new Set(values);
        inst._zod.values = valuesSet;
        inst._zod.pattern = new RegExp(`^(${values
        .filter((k) => propertyKeyTypes.has(typeof k))
        .map((o) => (typeof o === "string" ? escapeRegex(o) : o.toString()))
        .join("|")})$`);
        inst._zod.parse = (payload, _ctx) => {
            const input = payload.value;
            if (valuesSet.has(input)) {
                return payload;
            }
            payload.issues.push({
                code: "invalid_value",
                values,
                input,
                inst,
            });
            return payload;
        };
    });
    function handleOptionalResult(result, input) {
        if (result.issues.length && input === undefined) {
            return { issues: [], value: undefined };
        }
        return result;
    }
    const $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
        $ZodType.init(inst, def);
        inst._zod.optin = "optional";
        inst._zod.optout = "optional";
        defineLazy(inst._zod, "values", () => {
            return def.innerType._zod.values ? new Set([...def.innerType._zod.values, undefined]) : undefined;
        });
        defineLazy(inst._zod, "pattern", () => {
            const pattern = def.innerType._zod.pattern;
            return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : undefined;
        });
        inst._zod.parse = (payload, ctx) => {
            if (def.innerType._zod.optin === "optional") {
                const result = def.innerType._zod.run(payload, ctx);
                if (result instanceof Promise)
                    return result.then((r) => handleOptionalResult(r, payload.value));
                return handleOptionalResult(result, payload.value);
            }
            if (payload.value === undefined) {
                return payload;
            }
            return def.innerType._zod.run(payload, ctx);
        };
    });
    const $ZodDefault = /*@__PURE__*/ $constructor("$ZodDefault", (inst, def) => {
        $ZodType.init(inst, def);
        // inst._zod.qin = "true";
        inst._zod.optin = "optional";
        defineLazy(inst._zod, "values", () => def.innerType._zod.values);
        inst._zod.parse = (payload, ctx) => {
            if (ctx.direction === "backward") {
                return def.innerType._zod.run(payload, ctx);
            }
            // Forward direction (decode): apply defaults for undefined input
            if (payload.value === undefined) {
                payload.value = def.defaultValue;
                /**
                 * $ZodDefault returns the default value immediately in forward direction.
                 * It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
                return payload;
            }
            // Forward direction: continue with default handling
            const result = def.innerType._zod.run(payload, ctx);
            if (result instanceof Promise) {
                return result.then((result) => handleDefaultResult(result, def));
            }
            return handleDefaultResult(result, def);
        };
    });
    function handleDefaultResult(payload, def) {
        if (payload.value === undefined) {
            payload.value = def.defaultValue;
        }
        return payload;
    }

    function _string(Class, params) {
        return new Class({
            type: "string",
            ...normalizeParams(),
        });
    }
    function _number(Class, params) {
        return new Class({
            type: "number",
            checks: [],
            ...normalizeParams(),
        });
    }
    function _boolean(Class, params) {
        return new Class({
            type: "boolean",
            ...normalizeParams(),
        });
    }

    const ZodMiniType = /*@__PURE__*/ $constructor("ZodMiniType", (inst, def) => {
        if (!inst._zod)
            throw new Error("Uninitialized schema in ZodMiniType.");
        $ZodType.init(inst, def);
        inst.def = def;
        inst.type = def.type;
        inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
        inst.safeParse = (data, params) => safeParse(inst, data, params);
        inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
        inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
        inst.check = (...checks) => {
            return inst.clone({
                ...def,
                checks: [
                    ...(def.checks ?? []),
                    ...checks.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch),
                ],
            }
            // { parent: true }
            );
        };
        inst.clone = (_def, params) => clone(inst, _def, params);
        inst.brand = () => inst;
        inst.register = ((reg, meta) => {
            reg.add(inst, meta);
            return inst;
        });
    });
    const ZodMiniString = /*@__PURE__*/ $constructor("ZodMiniString", (inst, def) => {
        $ZodString.init(inst, def);
        ZodMiniType.init(inst, def);
    });
    function string(params) {
        return _string(ZodMiniString);
    }
    const ZodMiniNumber = /*@__PURE__*/ $constructor("ZodMiniNumber", (inst, def) => {
        $ZodNumber.init(inst, def);
        ZodMiniType.init(inst, def);
    });
    function number(params) {
        return _number(ZodMiniNumber);
    }
    const ZodMiniBoolean = /*@__PURE__*/ $constructor("ZodMiniBoolean", (inst, def) => {
        $ZodBoolean.init(inst, def);
        ZodMiniType.init(inst, def);
    });
    function boolean(params) {
        return _boolean(ZodMiniBoolean);
    }
    const ZodMiniArray = /*@__PURE__*/ $constructor("ZodMiniArray", (inst, def) => {
        $ZodArray.init(inst, def);
        ZodMiniType.init(inst, def);
    });
    function array(element, params) {
        return new ZodMiniArray({
            type: "array",
            element: element,
            ...normalizeParams(),
        });
    }
    const ZodMiniObject = /*@__PURE__*/ $constructor("ZodMiniObject", (inst, def) => {
        $ZodObject.init(inst, def);
        ZodMiniType.init(inst, def);
        defineLazy(inst, "shape", () => def.shape);
    });
    function object(shape, params) {
        const def = {
            type: "object",
            get shape() {
                assignProp(this, "shape", { ...shape });
                return this.shape;
            },
            ...normalizeParams(),
        };
        return new ZodMiniObject(def);
    }
    const ZodMiniRecord = /*@__PURE__*/ $constructor("ZodMiniRecord", (inst, def) => {
        $ZodRecord.init(inst, def);
        ZodMiniType.init(inst, def);
    });
    function record(keyType, valueType, params) {
        return new ZodMiniRecord({
            type: "record",
            keyType,
            valueType: valueType,
            ...normalizeParams(),
        });
    }
    const ZodMiniEnum = /*@__PURE__*/ $constructor("ZodMiniEnum", (inst, def) => {
        $ZodEnum.init(inst, def);
        ZodMiniType.init(inst, def);
        inst.options = Object.values(def.entries);
    });
    function _enum(values, params) {
        const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
        return new ZodMiniEnum({
            type: "enum",
            entries,
            ...normalizeParams(),
        });
    }
    const ZodMiniOptional = /*@__PURE__*/ $constructor("ZodMiniOptional", (inst, def) => {
        $ZodOptional.init(inst, def);
        ZodMiniType.init(inst, def);
    });
    function optional(innerType) {
        return new ZodMiniOptional({
            type: "optional",
            innerType: innerType,
        });
    }
    const ZodMiniDefault = /*@__PURE__*/ $constructor("ZodMiniDefault", (inst, def) => {
        $ZodDefault.init(inst, def);
        ZodMiniType.init(inst, def);
    });
    function _default(innerType, defaultValue) {
        return new ZodMiniDefault({
            type: "default",
            innerType: innerType,
            get defaultValue() {
                return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
            },
        });
    }

    const columnSchema = object({
        "type": _enum(["text", "html"]),
        "label": string(),
        "className": optional(string()),
        "sortable": boolean(),
        "searchable": boolean(),
    });

    const configSchema = object({
        "ajaxURL": string(),
        "ajaxMethod": _enum(["GET", "POST"]),
        "ajaxHeaders": _default(record(string(), string()), {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-Requested-By": "fetch-table"
        }),
        "debug": _default(boolean(), false),
        "columns": record(string(), columnSchema), // z.array(columnSchema),
        "elements": optional(object({
            "container": optional(object({
                "container": optional(object({
                    "className": optional(string()),
                    "querySelector": optional(string()),
                    "attributes": optional(record(string(), string())),
                })),
                "header": optional(object({
                    "className": optional(string()),
                    "querySelector": optional(string()),
                    "attributes": optional(record(string(), string())),
                })),
                "footer": optional(object({
                    "className": optional(string()),
                    "querySelector": optional(string()),
                    "attributes": optional(record(string(), string())),
                })),
            })),
            "table": optional(object({
                "table": optional(object({
                    "className": optional(string()),
                    "attributes": optional(record(string(), string())),
                })),
                "tableHead": optional(object({
                    "tableHead": optional(object({
                        "className": optional(string()),
                        "attributes": optional(record(string(), string())),
                    })),
                    "tableRow": optional(object({
                        "className": optional(string()),
                        "attributes": optional(record(string(), string())),
                    })),
                    "tableCell": optional(object({
                        "className": optional(string()),
                        "attributes": optional(record(string(), string())),
                    }))
                })),
                "tableBody": optional(object({
                    "tableBody": optional(object({
                        "className": optional(string()),
                        "attributes": optional(record(string(), string())),
                    })),
                    "tableRow": optional(object({
                        "className": optional(string()),
                        "attributes": optional(record(string(), string())),
                    })),
                    "tableCell": optional(object({
                        "className": optional(string()),
                        "attributes": optional(record(string(), string())),
                    }))
                })),
                "placeholder": optional(object({
                    "className": optional(string()),
                    "innerHTML": optional(string()),
                    "attributes": optional(record(string(), string())),
                }))
            })),
            "pagination": optional(object({
                "container": optional(object({
                    "className": optional(string()),
                    "attributes": optional(record(string(), string())),
                })),
                "button": optional(object({
                    "primary": optional(object({
                        "className": optional(string()),
                        "attributes": optional(record(string(), string())),
                    })),
                    "active": optional(object({
                        "className": optional(string()),
                        "attributes": optional(record(string(), string())),
                    })),
                    "ellipsis": optional(object({
                        "className": optional(string()),
                        "innerHTML": optional(string()),
                        "attributes": optional(record(string(), string())),
                    })),
                    "previous": optional(object({
                        "className": optional(string()),
                        "innerHTML": optional(string()),
                        "attributes": optional(record(string(), string())),
                    })),
                    "next": optional(object({
                        "className": optional(string()),
                        "innerHTML": optional(string()),
                        "attributes": optional(record(string(), string())),
                    })),
                })),
                "sizeSelector": optional(object({
                    "container": optional(object({
                        "className": optional(string()),
                        "attributes": optional(record(string(), string())),
                    })),
                    "select": optional(object({
                        "className": optional(string()),
                        "attributes": optional(record(string(), string())),
                    })),
                    "option": optional(object({
                        "className": optional(string()),
                        "attributes": optional(record(string(), string())),
                    }))
                }))
            })),
            "search": optional(object({
                "container": optional(object({
                    "className": optional(string()),
                    "attributes": optional(record(string(), string())),
                })),
                "input": optional(object({
                    "className": optional(string()),
                    "attributes": optional(record(string(), string())),
                }))
            })),
        })),
        "components": object({
            "pagination": object({
                "active": boolean(),
                "pageSize": number(),
                "availableSizes": array(number()),
                "style": _enum(["standard", "simple"]),
            }),
            "search": object({
                "active": boolean(),
            }),
        }),
    });

    function createElement(tagName, options = {}) {
        const element = document.createElement(tagName);
        Object.entries(options).forEach(([key, value]) => {
            if (value === undefined || value === null)
                return;
            if (key === "attributes") {
                Object.entries(value).forEach(([attrKey, attrValue]) => {
                    element.setAttribute(attrKey, String(attrValue));
                });
            }
            else if (key in element) {
                element[key] = value;
            }
            else {
                element.setAttribute(key, String(value));
            }
        });
        return element;
    }

    class EventDispatcher {
        constructor() {
            this._handlers = {};
        }
        /**
         * Registers an event listener with a specified priority.
         *
         * @param event
         * @param callback
         * @param priority
         */
        register(event, callback, priority = 1000) {
            if (!this._handlers[event]) {
                this._handlers[event] = [];
            }
            this._handlers[event].push({ callback: callback, priority: priority });
        }
        /**
         * Dispatches an event to all registered handlers for the given event name.
         * Handlers are executed in the order of their priority.
         *
         * @param name
         * @param data
         */
        dispatch(name, data) {
            this._handlers[name]
                ?.sort((a, b) => a.priority - b.priority)
                .forEach(handler => {
                handler.callback(data);
            });
        }
    }

    const responseSchema = object({
        "pagination": optional(object({
            "page": number(),
            "pageSize": number(),
            "totalPages": number(),
        })),
        "data": array(array(object({
            "column": string(),
            "className": optional(string()),
            "value": string()
        }))),
    });

    class Client {
        constructor(config, eventDispatcher) {
            this._sort = null;
            this._pagination = null;
            this._search = null;
            this._config = config;
            this._eventDispatcher = eventDispatcher;
        }
        /**
         * Refreshes data by triggering an AJAX request to the configured URL.
         * Handles the data response and dispatches appropriate events in the process,
         * including "before-data-fetch", "data-fetch", "after-data-fetch", and "data-fetch-error".
         */
        refresh() {
            if (this._config.debug)
                console.info("Refreshing data..");
            // Generate request
            const fetchRequest = this.generateRequest();
            // Dispatch event with fetch request to allow for custom handling
            this._eventDispatcher.dispatch("before-data-fetch", fetchRequest);
            fetch(fetchRequest).then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        const responseData = responseSchema.parse(data);
                        // Dispatch event
                        this._eventDispatcher.dispatch("data-fetch", responseData);
                        this._eventDispatcher.dispatch("after-data-fetch");
                    }).catch(error => {
                        if (this._config.debug)
                            console.error(error);
                        this._eventDispatcher.dispatch("data-fetch-error", { error: error });
                        this._eventDispatcher.dispatch("after-data-fetch");
                    });
                }
            }).catch(error => {
                if (this._config.debug)
                    console.error(error);
                this._eventDispatcher.dispatch("data-fetch-error", { error: error });
                this._eventDispatcher.dispatch("after-data-fetch");
            });
        }
        get sort() {
            return this._sort;
        }
        set sort(value) {
            this._sort = value;
        }
        get pagination() {
            return this._pagination;
        }
        set pagination(value) {
            this._pagination = value;
        }
        get search() {
            return this._search;
        }
        set search(value) {
            this._search = value;
        }
        /**
         * Generates and returns a new Request object based on the current configuration.
         *
         * The request is constructed using parameters defined in the `_config` object.
         * Depending on the HTTP method specified in `_config.ajaxMethod`, the request URL and body
         * will be formatted accordingly.
         *
         * For `GET` requests, the URL is appended with query parameters generated by `generateURLSearchParams()`.
         * For `POST` requests, the request body is generated by `generateRequestBody()` and stringifies as JSON.
         *
         * @private
         * @returns {Request}
         */
        generateRequest() {
            const ajaxURL = this._config.ajaxMethod === "GET" ? this._config.ajaxURL + "?" + this.generateURLSearchParams() : this._config.ajaxURL;
            const ajaxBody = this._config.ajaxMethod === "POST" ? JSON.stringify(this.generateRequestBody()) : null;
            return new Request(ajaxURL, {
                method: this._config.ajaxMethod,
                headers: this._config.ajaxHeaders,
                body: ajaxBody,
            });
        }
        /**
         * Generates and returns the request body containing pagination and sort data.
         *
         * @private
         */
        generateRequestBody() {
            let requestBody = {};
            if (this._search !== null) {
                requestBody = { ...requestBody, search: this._search };
            }
            if (this._pagination !== null) {
                requestBody = {
                    ...requestBody,
                    pagination: { page: this._pagination.page, size: this._pagination.pageSize }
                };
            }
            if (this._sort !== null) {
                requestBody = {
                    ...requestBody,
                    sort: { column: this._sort.columnName, direction: this._sort.direction }
                };
            }
            return requestBody;
        }
        /**
         * Generates and returns URL search parameters based on the current pagination and sort settings.
         *
         * If pagination details are available, they are added as "pagination-page" and "pagination-size" parameters.
         * If sorting details are specified, they are added as "sort-column" and "sort-direction" parameters.
         *
         * @return {URLSearchParams}
         */
        generateURLSearchParams() {
            let params = new URLSearchParams();
            if (this._search !== null) {
                params.append("search", this._search);
            }
            if (this._pagination !== null) {
                params.append("pagination[page]", this._pagination.page.toString());
                params.append("pagination[size]", this._pagination.pageSize.toString());
            }
            if (this._sort !== null) {
                params.append("sort[column]", this._sort.columnName);
                params.append("sort[direction]", this._sort.direction);
            }
            return params;
        }
    }

    class Component {
        constructor(coreElement, config, eventDispatcher, client) {
            this._config = config;
            this._coreElement = coreElement;
            this._eventDispatcher = eventDispatcher;
            this._client = client;
        }
    }

    class TableComponent extends Component {
        constructor(coreElement, config, eventDispatcher, client) {
            super(coreElement, config, eventDispatcher, client);
            this._isLoading = false;
            this._sort = null;
            this._elements = {
                table: null,
                head: null,
                body: null
            };
            // Register event handlers
            this._eventDispatcher.register("before-data-fetch", () => this._isLoading = true);
            this._eventDispatcher.register("data-fetch", (data) => this.render(data));
            this._eventDispatcher.register("after-data-fetch", () => this._isLoading = false);
            this.init();
        }
        /**
         * Initializes the table component by creating and appending the table's core elements,
         * including the table, header, and body, as well as setting up column headers and sorting behavior.
         */
        init() {
            if (this._config.debug)
                console.info("[Table Component] Initializing..");
            this._coreElement.innerHTML = "";
            // Create core elements
            this._elements.table = createElement("table", {
                className: this._config.elements?.table?.table?.className,
                attributes: this._config.elements?.table?.table?.attributes
            });
            this._elements.head = createElement("thead", {
                className: this._config.elements?.table?.tableHead?.tableHead?.className,
                attributes: this._config.elements?.table?.tableHead?.tableHead?.attributes
            });
            this._elements.body = createElement("tbody", {
                className: this._config.elements?.table?.tableBody?.tableBody?.className,
                attributes: this._config.elements?.table?.tableBody?.tableBody?.attributes
            });
            // Create header cells
            const columnRowElement = createElement("tr", {
                className: this._config.elements?.table?.tableHead?.tableRow?.className,
                attributes: this._config.elements?.table?.tableHead?.tableRow?.attributes,
            });
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
            for (const [name, column] of Object.entries(this._config.columns)) {
                const columnElement = createElement("th", {
                    scope: "col",
                    className: column.className || this._config.elements?.table?.tableHead?.tableCell?.className,
                    attributes: this._config.elements?.table?.tableHead?.tableCell?.attributes,
                    innerHTML: column.label
                });
                if (column.sortable) {
                    columnElement.addEventListener("click", () => {
                        if (!this._isLoading) {
                            if (this._config.debug)
                                console.info(`[Table Component] Sort by the column: ${name}`);
                            // Update sort object, dispatch event and refresh data
                            if (this._sort === null) {
                                this._sort = { columnName: name, direction: "ASC" };
                            }
                            else {
                                if (this._sort.columnName === name) {
                                    this._sort.direction = this._sort.direction === "ASC" ? "DESC" : "ASC";
                                }
                                else {
                                    this._sort = { columnName: name, direction: "ASC" };
                                }
                            }
                            this._eventDispatcher.dispatch("sort-change", this._sort);
                            this._client.sort = this._sort;
                            this._client.refresh();
                        }
                    });
                }
                columnRowElement.appendChild(columnElement);
            }
            this._elements.head.appendChild(columnRowElement);
            this._elements.table.appendChild(this._elements.head);
            this._elements.table.appendChild(this._elements.body);
            this._coreElement.appendChild(this._elements.table);
        }
        /**
         * Renders the table data to the body element of the table component.
         * Validates the required elements' presence and updates the DOM based on the provided data.
         * Throws an error if the body element is not initialized or if column data is missing.
         *
         * @param data
         * @private
         */
        render(data) {
            if (this._config.debug)
                console.info("[Table Component] Rendering data..");
            if (this._elements.body === null) {
                throw new Error("[Table Component] Body element couldn't be found. First, initialize the component with the init() method");
            }
            this._elements.body.innerHTML = "";
            // Check if data is empty and show the placeholder if needed
            if (data.data.length === 0) {
                const placeholderElement = createElement("tr", {
                    className: this._config.elements?.table?.tableBody?.tableRow?.className,
                    attributes: this._config.elements?.table?.tableBody?.tableRow?.attributes,
                });
                const placeholderCellElement = createElement("td", {
                    colSpan: this._config.columns.length,
                    className: this._config.elements?.table?.placeholder?.className || this._config.elements?.table?.tableBody?.tableCell?.className,
                    attributes: this._config.elements?.table?.placeholder?.attributes,
                    innerHTML: this._config.elements?.table?.placeholder?.innerHTML,
                });
                placeholderElement.appendChild(placeholderCellElement);
                this._elements.body?.appendChild(placeholderElement);
            }
            else {
                data.data.forEach(dataItem => {
                    const rowElement = createElement("tr", {
                        className: this._config.elements?.table?.tableBody?.tableRow?.className,
                        attributes: this._config.elements?.table?.tableBody?.tableRow?.attributes,
                    });
                    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
                    for (const [name, column] of Object.entries(this._config.columns)) {
                        const item = dataItem.find(function (item) {
                            return item.column === name;
                        });
                        if (item === undefined) {
                            throw new Error(`[Table Component] Column ${name} not found`);
                        }
                        const columnElement = createElement("td", {
                            className: item.className || this._config.elements?.table?.tableBody?.tableCell?.className,
                            attributes: this._config.elements?.table?.tableBody?.tableCell?.attributes
                        });
                        // Set cell content based on the column type
                        if (column.type === "text") {
                            columnElement.innerText = item.value;
                        }
                        else if (column.type === "html") {
                            columnElement.innerHTML = item.value;
                        }
                        rowElement.appendChild(columnElement);
                    }
                    this._elements.body?.appendChild(rowElement);
                });
            }
        }
    }

    class PaginationComponent extends Component {
        constructor(coreElement, config, eventDispatcher, client) {
            super(coreElement, config, eventDispatcher, client);
            this._isLoading = false;
            this._elements = {
                container: null,
                sizeContainer: null,
                sizeSelect: null
            };
            // Register event handlers
            this._eventDispatcher.register("before-data-fetch", () => this._isLoading = true);
            this._eventDispatcher.register("data-fetch", (data) => this.render(data));
            this._eventDispatcher.register("after-data-fetch", () => this._isLoading = false);
            this.init();
        }
        /**
         * Initializes the pagination component by setting up its core container and clearing existing content.
         * This method creates a navigation container element with the specified class name and ARIA label,
         * then appends it to the core element of the component.
         */
        init() {
            if (this._config.debug)
                console.info("[Pagination Component] Initializing..");
            this._coreElement.innerHTML = "";
            this._elements.container = createElement("nav", {
                className: this._config.elements?.pagination?.container?.className,
                attributes: this._config.elements?.pagination?.container?.attributes,
                ariaLabel: "Pagination"
            });
            this._elements.sizeContainer = createElement("div", {
                className: this._config.elements?.pagination?.sizeSelector?.container?.className,
                attributes: this._config.elements?.pagination?.sizeSelector?.container?.attributes
            });
            const sizeSelectElement = createElement("select", {
                name: "at-size-selector",
                className: this._config.elements?.pagination?.sizeSelector?.select?.className,
                attributes: this._config.elements?.pagination?.sizeSelector?.select?.attributes
            });
            this._config.components?.pagination?.availableSizes?.forEach(size => {
                const optionElement = createElement("option", {
                    value: size,
                    innerText: size.toString(),
                    selected: size === this._client.pagination?.pageSize ? "selected" : null,
                });
                sizeSelectElement.appendChild(optionElement);
            });
            sizeSelectElement.addEventListener("change", () => {
                if (!this._isLoading) {
                    if (this._config.debug)
                        console.info(`[Pagination Component] Changing page size to ${sizeSelectElement.value}`);
                    // Create the pagination object, dispatch event and refresh data
                    let pagination = {
                        page: 1,
                        pageSize: parseInt(sizeSelectElement.value)
                    };
                    this._eventDispatcher.dispatch("pagination-size-change", pagination);
                    this._client.pagination = pagination;
                    this._client.refresh();
                }
            });
            this._elements.sizeContainer.appendChild(sizeSelectElement);
            this._coreElement.appendChild(this._elements.sizeContainer);
            this._coreElement.appendChild(this._elements.container);
        }
        /**
         * Renders the pagination controls and initializes event listeners for navigating between pages.
         *
         * @param data
         * @private
         */
        render(data) {
            if (this._config.debug)
                console.info("[Pagination Component] Rendering data..");
            if (this._elements.container === null) {
                throw new Error("[Pagination Component] Container element couldn't be found. First, initialize the component with the init() method");
            }
            // Internal function to get the pagination data from the response
            const paginationData = () => {
                if (data.pagination === undefined) {
                    throw new Error("[Pagination Component] Pagination data is missing. Please check your API response");
                }
                return data.pagination;
            };
            this._elements.container.innerText = "";
            const previousButtonElement = createElement("button", {
                className: this._config.elements?.pagination?.button?.previous?.className || this._config.elements?.pagination?.button?.primary?.className,
                attributes: this._config.elements?.pagination?.button?.previous?.attributes,
                innerHTML: this._config.elements?.pagination?.button?.previous?.innerHTML,
                disabled: paginationData().page === 1 ? "disabled" : null,
                type: "button"
            });
            previousButtonElement.addEventListener("click", () => {
                if (!this._isLoading) {
                    if (paginationData().page > 1) {
                        if (this._config.debug)
                            console.info(`[Pagination Component] Moving to the previous page`);
                        // Create the pagination object, dispatch event and refresh data
                        let pagination = {
                            page: paginationData().page - 1,
                            pageSize: paginationData().pageSize
                        };
                        this._eventDispatcher.dispatch("pagination-change", pagination);
                        this._client.pagination = pagination;
                        this._client.refresh();
                    }
                }
            });
            const nextButtonElement = createElement("button", {
                type: "button",
                className: this._config.elements?.pagination?.button?.next?.className || this._config.elements?.pagination?.button?.primary?.className,
                attributes: this._config.elements?.pagination?.button?.next?.attributes,
                innerHTML: this._config.elements?.pagination?.button?.next?.innerHTML,
                disabled: paginationData().page === paginationData().totalPages ? "disabled" : null
            });
            nextButtonElement.addEventListener("click", () => {
                if (!this._isLoading) {
                    if (paginationData().page < paginationData().totalPages) {
                        if (this._config.debug)
                            console.info(`[Pagination Component] Moving to the next page`);
                        // Create the pagination object, dispatch event and refresh data
                        let pagination = {
                            page: paginationData().page + 1,
                            pageSize: paginationData().pageSize
                        };
                        this._eventDispatcher.dispatch("pagination-change", pagination);
                        this._client.pagination = pagination;
                        this._client.refresh();
                    }
                }
            });
            // Create structure
            this._elements.container?.appendChild(previousButtonElement);
            if (this._config.components?.pagination?.style !== "simple") {
                /**
                 * Internal function to create a button element with the specified page number and active state.
                 *
                 * @param pageNumber
                 * @param isActive
                 */
                const createButtonElement = (pageNumber, isActive = false) => {
                    const buttonElement = createElement("button", {
                        className: isActive ? this._config.elements?.pagination?.button?.active?.className || this._config.elements?.pagination?.button?.primary?.className : this._config.elements?.pagination?.button?.primary?.className,
                        attributes: this._config.elements?.pagination?.button?.active?.attributes,
                        innerText: pageNumber.toString(),
                        type: "button"
                    });
                    buttonElement.addEventListener("click", () => {
                        if (!this._isLoading) {
                            if (this._config.debug)
                                console.info(`[Pagination Component] Moving to page number: ${pageNumber}`);
                            // Create the pagination object, dispatch event and refresh data
                            let pagination = {
                                page: pageNumber,
                                pageSize: paginationData().pageSize
                            };
                            this._eventDispatcher.dispatch("pagination-change", pagination);
                            this._client.pagination = { page: pageNumber, pageSize: paginationData().pageSize };
                            this._client.refresh();
                        }
                    });
                    return buttonElement;
                };
                /**
                 * Internal function to create an ellipsis element with the specified class name and HTML content.
                 */
                const createEllipsisElement = () => {
                    return createElement("span", {
                        className: this._config.elements?.pagination?.button?.ellipsis?.className || this._config.elements?.pagination?.button?.primary?.className,
                        attributes: this._config.elements?.pagination?.button?.previous?.attributes,
                        innerHTML: this._config.elements?.pagination?.button?.ellipsis?.innerHTML || "..",
                    });
                };
                // Always show the first page button
                const firstButtonElement = createButtonElement(1, 1 === paginationData().page);
                this._elements.container?.appendChild(firstButtonElement);
                // Add ellipsis after the first page if needed (on page 5 or more)
                if (paginationData().page > 4) {
                    this._elements.container?.appendChild(createEllipsisElement());
                }
                // Show pages around the current page
                // Example: 1 2 3 4 5 .. 20
                // Example: 1 .. 4 5 6 .. 20
                // Example: 1 .. 16 17 18 19 20
                if (paginationData().page < 5) {
                    for (let i = 2; i <= Math.min(5, paginationData().totalPages - 1); i++) {
                        const buttonElement = createButtonElement(i, i === paginationData().page);
                        this._elements.container?.appendChild(buttonElement);
                    }
                }
                else if (paginationData().page > paginationData().totalPages - 4) {
                    for (let i = Math.max(paginationData().totalPages - 4, 2); i <= paginationData().totalPages - 1; i++) {
                        const buttonElement = createButtonElement(i, i === paginationData().page);
                        this._elements.container?.appendChild(buttonElement);
                    }
                }
                else {
                    for (let i = paginationData().page - 1; i <= paginationData().page + 1; i++) {
                        const buttonElement = createButtonElement(i, i === paginationData().page);
                        this._elements.container?.appendChild(buttonElement);
                    }
                }
                // Add ellipsis before the last page if needed
                if (paginationData().page <= paginationData().totalPages - 4) {
                    this._elements.container?.appendChild(createEllipsisElement());
                }
                // Show the last page button when there are more pages than 1
                if (paginationData().totalPages > 1) {
                    const lastButton = createButtonElement(paginationData().totalPages, paginationData().totalPages === paginationData().page);
                    this._elements.container?.appendChild(lastButton);
                }
            }
            this._elements.container?.appendChild(nextButtonElement);
        }
    }

    class SearchComponent extends Component {
        constructor(coreElement, config, eventDispatcher, client) {
            super(coreElement, config, eventDispatcher, client);
            this._isLoading = false;
            // Register event handlers
            this._eventDispatcher.register("before-data-fetch", () => this._isLoading = true);
            this._eventDispatcher.register("after-data-fetch", () => this._isLoading = false);
            this.init();
        }
        init() {
            if (this._config.debug)
                console.info("[Search Component] Initializing..");
            this._coreElement.innerHTML = "";
            const containerElement = createElement("div", {
                className: this._config.elements?.search?.container?.className,
                attributes: this._config.elements?.search?.container?.attributes,
            });
            const inputElement = createElement("input", {
                type: "text",
                className: this._config.elements?.search?.input?.className,
                attributes: this._config.elements?.search?.input?.attributes,
            });
            let inputTimeout = null;
            inputElement.addEventListener("keyup", () => {
                if (!this._isLoading) {
                    clearTimeout(inputTimeout);
                    inputTimeout = setTimeout(() => {
                        if (this._config.debug)
                            console.info(`[Search Component] Searching for "${inputElement.value}"`);
                        // Get search query, dispatch event and refresh data
                        let searchQuery = inputElement.value;
                        this._eventDispatcher.dispatch("search-change", searchQuery);
                        this._client.search = searchQuery;
                        this._client.refresh();
                    }, 500);
                }
            });
            containerElement.appendChild(inputElement);
            this._coreElement.appendChild(containerElement);
        }
    }

    class FetchTable {
        constructor(elementSelector, config) {
            this._components = {
                table: null,
                pagination: null,
                search: null
            };
            this._config = this.validateConfig(config);
            this._coreElement = document.querySelector(elementSelector);
            if (!this._coreElement) {
                throw new Error("Container element couldn't be found.");
            }
            // Clear the core element
            this._coreElement.innerHTML = "";
            // Search for an existing header container element or create a new one
            let headerContainerElement = this.selectElement(this._config.elements?.container?.header?.querySelector);
            if (headerContainerElement === null) {
                headerContainerElement = createElement("div", {
                    className: this._config.elements?.container?.header?.className,
                    attributes: this._config.elements?.container?.header?.attributes,
                });
                this._coreElement.appendChild(headerContainerElement);
            }
            // Search for an existing container element or create a new one
            let containerElement = this.selectElement(this._config.elements?.container?.container?.querySelector);
            if (containerElement === null) {
                containerElement = createElement("div", {
                    className: this._config.elements?.container?.container?.className,
                    attributes: this._config.elements?.container?.container?.attributes,
                });
                this._coreElement.appendChild(containerElement);
            }
            // Search for an existing footer container element or create a new one
            let footerContainerElement = this.selectElement(this._config.elements?.container?.footer?.querySelector);
            if (footerContainerElement === null) {
                footerContainerElement = createElement("div", {
                    className: this._config.elements?.container?.footer?.className,
                    attributes: this._config.elements?.container?.footer?.attributes,
                });
                this._coreElement.appendChild(footerContainerElement);
            }
            // Define modules
            this._eventDispatcher = new EventDispatcher();
            this._client = new Client(this._config, this._eventDispatcher);
            // Register components
            this._components.table = new TableComponent(containerElement, this._config, this._eventDispatcher, this._client);
            if (this._config.components?.search?.active === true) {
                this._components.search = new SearchComponent(headerContainerElement, this._config, this._eventDispatcher, this._client);
            }
            if (this._config.components?.pagination?.active === true) {
                this._client.pagination = { page: 1, pageSize: this._config.components.pagination.pageSize };
                this._components.pagination = new PaginationComponent(footerContainerElement, this._config, this._eventDispatcher, this._client);
            }
        }
        /**
         * Shortcut for register an event listener for the specified event type.
         *
         * @param event
         * @param callback
         */
        on(event, callback) {
            this._eventDispatcher.register(event, callback, 1000);
        }
        /**
         * Retrieves the current configuration settings.
         */
        get config() {
            return this._config;
        }
        /**
         * Retrieves the event dispatcher instance.
         * The event dispatcher is responsible for managing event listeners and dispatching events.
         */
        get eventDispatcher() {
            return this._eventDispatcher;
        }
        /**
         * Retrieves the current HTTP client instance.
         */
        get client() {
            return this._client;
        }
        /**
         * Refreshes the data displayed in the table component.
         */
        refreshData() {
            this._client.refresh();
        }
        /**
         * Validates the provided configuration object against the defined schema.
         *
         * @param config
         * @private
         */
        validateConfig(config) {
            const configParse = configSchema.safeParse(config);
            if (configParse.success) {
                return configParse.data;
            }
            throw new Error(`Exception while config validation: ${configParse.error.message}`);
        }
        /**
         * Selects an element from the document based on the provided query selector.
         * Returns null if the element is not found or the query selector is empty.
         *
         * @param querySelector
         * @private
         */
        selectElement(querySelector) {
            if (querySelector !== null && querySelector !== undefined && querySelector !== "") {
                return document.querySelector(querySelector);
            }
            return null;
        }
    }

    return FetchTable;

}));
