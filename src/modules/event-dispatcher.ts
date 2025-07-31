export default class EventDispatcher {
    private _handlers: { [key: string]: { callback: (data?: any) => void, priority: number }[] } = {};

    /**
     * Registers an event listener with a specified priority.
     *
     * @param event
     * @param callback
     * @param priority
     */
    public register(event: string, callback: (data?: any) => void, priority: number = 1000): void {
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
    public dispatch(name: string, data?: any): void {
        this._handlers[name]
            ?.sort((a, b) => a.priority - b.priority)
            .forEach(handler => {
                handler.callback(data);
            });
    }
}
