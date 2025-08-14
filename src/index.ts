import { configSchema, ConfigSchema } from "./schema/config";
import { createElement } from "./utils/create-element";
import EventDispatcher from "./modules/event-dispatcher";
import Client from "./modules/client";
import TableComponent from "./components/table";
import PaginationComponent from "./components/pagination";
import SearchComponent from "./components/search";

export default class FetchTable {
    private readonly _config: ConfigSchema;
    private readonly _coreElement: HTMLElement | null;
    private readonly _eventDispatcher: EventDispatcher;
    private readonly _client: Client;
    private readonly _components: {
        table: TableComponent | null,
        pagination: PaginationComponent | null,
        search: SearchComponent | null
    } = {
        table: null,
        pagination: null,
        search: null
    };

    constructor(elementSelector: string, config: ConfigSchema) {
        this._config = this.validateConfig(config);
        this._coreElement = document.querySelector(elementSelector);

        if (!this._coreElement) {
            throw new Error("Container element couldn't be found.");
        }

        // Clear the core element
        this._coreElement.innerHTML = "";

        // Search for an existing header container element or create a new one
        let headerContainerElement = this.selectElement(
            this._config.elements?.container?.header?.querySelector
        );

        if (headerContainerElement === null) {
            headerContainerElement = createElement("div", {
                className: this._config.elements?.container?.header?.className,
                attributes: this._config.elements?.container?.header?.attributes,
            });

            this._coreElement.appendChild(headerContainerElement);
        }

        // Search for an existing container element or create a new one
        let containerElement = this.selectElement(
            this._config.elements?.container?.container?.querySelector
        );

        if (containerElement === null) {
            containerElement = createElement("div", {
                className: this._config.elements?.container?.container?.className,
                attributes: this._config.elements?.container?.container?.attributes,
            });

            this._coreElement.appendChild(containerElement);
        }

        // Search for an existing footer container element or create a new one
        let footerContainerElement = this.selectElement(
            this._config.elements?.container?.footer?.querySelector
        );

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
    on(event: string, callback: (data?: any) => void): void {
        this._eventDispatcher.register(event, callback, 1000);
    }

    /**
     * Retrieves the current configuration settings.
     */
    get config(): ConfigSchema {
        return this._config;
    }

    /**
     * Retrieves the event dispatcher instance.
     * The event dispatcher is responsible for managing event listeners and dispatching events.
     */
    get eventDispatcher(): EventDispatcher {
        return this._eventDispatcher;
    }

    /**
     * Retrieves the current HTTP client instance.
     */
    get client(): Client {
        return this._client;
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

    /**
     * Selects an element from the document based on the provided query selector.
     * Returns null if the element is not found or the query selector is empty.
     *
     * @param querySelector
     * @private
     */
    private selectElement(querySelector: string | null | undefined): HTMLElement | null {
        if (querySelector !== null && querySelector !== undefined && querySelector !== "") {
            return document.querySelector(querySelector) as HTMLElement;
        }

        return null;
    }
};
