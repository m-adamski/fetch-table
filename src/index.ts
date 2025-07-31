import { configSchema, ConfigSchema } from "./schema/config";
import { Component } from "./interfaces/component";
import EventDispatcher from "./modules/event-dispatcher";
import Client from "./modules/client";
import TableComponent from "./components/table";

export default class AjaxTable {
    private readonly _config: ConfigSchema;
    private readonly _coreElement: HTMLElement | null;
    private readonly _eventDispatcher: EventDispatcher;
    private readonly _client: Client;
    private readonly _components: { table: Component | null, pagination: Component | null } = {
        table: null,
        pagination: null,
    };

    constructor(elementSelector: string, config: ConfigSchema) {
        this._config = this.validateConfig(config);
        this._coreElement = document.querySelector(elementSelector);

        if (!this._coreElement) {
            throw new Error("Container element couldn't be found.");
        }

        this._eventDispatcher = new EventDispatcher();
        this._client = new Client(this._config, this._eventDispatcher);

        // Register components
        this._components.table = new TableComponent(this._coreElement, this._config, this._eventDispatcher, this._client);

        this._client.refresh();
    }

    /**
     * Shortcut for register an event listener for the specified event type.
     *
     * @param event
     * @param callback
     */
    on(event: string, callback: (data?: any) => void): void {
        this._eventDispatcher.register(event, callback, 1000);
    }

    /**
     * Validates the provided configuration object against the defined schema.
     *
     * @param config
     * @private
     */
    private validateConfig(config: ConfigSchema): ConfigSchema {
        const configParse = configSchema.safeParse(config);
        if (configParse.success) {
            return configParse.data;
        }

        throw new Error(`Exception while config validation: ${ configParse.error.message }`);
    }
};
