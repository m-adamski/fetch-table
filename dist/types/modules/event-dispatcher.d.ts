export default class EventDispatcher {
    private _handlers;
    /**
     * Registers an event listener with a specified priority.
     *
     * @param event
     * @param callback
     * @param priority
     */
    register(event: string, callback: (data?: any) => void, priority?: number): void;
    /**
     * Dispatches an event to all registered handlers for the given event name.
     * Handlers are executed in the order of their priority.
     *
     * @param name
     * @param data
     */
    dispatch(name: string, data?: any): void;
}
