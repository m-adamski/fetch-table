import { describe, it, expect, vi } from "vitest";
import EventDispatcher from "../../src/modules/event-dispatcher";

describe("EventDispatcher", () => {
    it("should register and dispatch events", () => {
        const dispatcher = new EventDispatcher();
        const callback = vi.fn();

        dispatcher.register("test-event", callback);
        dispatcher.dispatch("test-event", { foo: "bar" });

        expect(callback).toHaveBeenCalledWith({ foo: "bar" });
    });

    it("should dispatch events in priority order", () => {
        const dispatcher = new EventDispatcher();
        const executionOrder: number[] = [];

        dispatcher.register("order-event", () => executionOrder.push(2), 2000);
        dispatcher.register("order-event", () => executionOrder.push(1), 1000);
        dispatcher.register("order-event", () => executionOrder.push(3), 3000);

        dispatcher.dispatch("order-event");

        expect(executionOrder).toEqual([1, 2, 3]);
    });

    it("should handle dispatching events with no handlers", () => {
        const dispatcher = new EventDispatcher();
        expect(() => dispatcher.dispatch("non-existent")).not.toThrow();
    });

    it("should support multiple handlers for the same event", () => {
        const dispatcher = new EventDispatcher();
        const cb1 = vi.fn();
        const cb2 = vi.fn();

        dispatcher.register("multi", cb1);
        dispatcher.register("multi", cb2);
        dispatcher.dispatch("multi", "data");

        expect(cb1).toHaveBeenCalledWith("data");
        expect(cb2).toHaveBeenCalledWith("data");
    });
});
