import { configSchema, ConfigSchema } from "./schema/config";
import { Component } from "./interfaces/component";
import { createElement } from "./utils/create-element";
import EventDispatcher from "./modules/event-dispatcher";
import Client from "./modules/client";
import TableComponent from "./components/table";
import PaginationComponent from "./components/pagination";

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

        // Build core HTML structure
        const containerElement = createElement("div", {
            className: this._config.classNames?.container
        });
        const footerElement = createElement("div", {
            className: this._config.classNames?.footerContainer
        });

        this._coreElement.innerHTML = "";
        this._coreElement.appendChild(containerElement);
        this._coreElement.appendChild(footerElement);

        // Define modules
        this._eventDispatcher = new EventDispatcher();
        this._client = new Client(this._config, this._eventDispatcher);

        // Register components
        this._components.table = new TableComponent(containerElement, this._config, this._eventDispatcher, this._client);

        if (this._config.pagination?.active === true) {
            this._client.pagination = { page: 1, pageSize: this._config.pagination.pageSize };
            this._components.pagination = new PaginationComponent(footerElement, this._config, this._eventDispatcher, this._client);
        }

        // this._client.refresh();
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
     * Refreshes the data displayed in the table component.
     */
    refreshData(): void {
        this._client.refresh();
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
