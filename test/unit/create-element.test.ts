import { describe, it, expect } from "vitest";
import { createElement } from "../../src/utils/create-element";

describe("createElement", () => {
    it("should create an element with specified tag name", () => {
        const el = createElement("div");
        expect(el.tagName.toLowerCase()).toBe("div");
    });

    it("should apply className", () => {
        const el = createElement("span", { className: "test-class" });
        expect(el.className).toBe("test-class");
    });

    it("should apply attributes", () => {
        const el = createElement("button", {
            attributes: {
                "type": "submit",
                "disabled": "true",
                "data-test": "value"
            }
        });
        expect(el.getAttribute("type")).toBe("submit");
        expect(el.getAttribute("disabled")).toBe("true");
        expect(el.getAttribute("data-test")).toBe("value");
    });

    it("should apply direct properties", () => {
        const el = createElement("input", { type: "text", value: "hello" });
        expect(el.type).toBe("text");
        expect(el.value).toBe("hello");
    });

    it("should handle nested attributes in options", () => {
        const el = createElement("div", { id: "my-id", "data-foo": "bar" });
        expect(el.id).toBe("my-id");
        expect(el.getAttribute("data-foo")).toBe("bar");
    });

    it("should skip null or undefined values", () => {
        const el = createElement("div", { className: null, id: undefined });
        expect(el.className).toBe("");
        expect(el.id).toBe("");
    });
});
