import { ConfigSchema } from "./schema/config";
import EventDispatcher from "./modules/event-dispatcher";
import Client from "./modules/client";
export default class FetchTable {
    private readonly _config;
    private readonly _coreElement;
    private readonly _eventDispatcher;
    private readonly _client;
    private readonly _components;
    constructor(elementSelector: string, config: ConfigSchema);
    /**
     * Shortcut for register an event listener for the specified event type.
     *
     * @param event
     * @param callback
     */
    on(event: string, callback: (data?: any) => void): void;
    /**
     * Retrieves the current configuration settings.
     */
    get config(): ConfigSchema;
    /**
     * Retrieves the event dispatcher instance.
     * The event dispatcher is responsible for managing event listeners and dispatching events.
     */
    get eventDispatcher(): EventDispatcher;
    /**
     * Retrieves the current HTTP client instance.
     */
    get client(): Client;
    /**
     * Refreshes the data displayed in the table component.
     */
    refreshData(): void;
    /**
     * Validates the provided configuration object against the defined schema.
     *
     * @param config
     * @private
     */
    private validateConfig;
    /**
     * Selects an element from the document based on the provided query selector.
     * Returns null if the element is not found or the query selector is empty.
     *
     * @param querySelector
     * @private
     */
    private selectElement;
}
