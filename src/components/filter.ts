import Component from "./component";
import { ConfigSchema } from "../schema/config";
import { Filter } from "../interfaces/filter";
import { createElement } from "../utils/create-element";
import EventDispatcher from "../modules/event-dispatcher";
import Client from "../modules/client";

export default class FilterComponent extends Component {
    constructor(coreElement: HTMLElement, config: ConfigSchema, eventDispatcher: EventDispatcher, client: Client) {
        super(coreElement, config, eventDispatcher, client);

        this.init();
    }

    private init(): void {
        if (this._config.debug) console.info("[Filter Component] Initializing..");

        const containerElement = createElement("div", {
            className: this._config.elements?.filter?.container?.className,
            attributes: this._config.elements?.filter?.container?.attributes,
        });

        // Iterate over filters
        this._config.components.filter?.filters.forEach((filter) => {
            const filterContainerElement = createElement("div", {
                className: this._config.elements?.filter?.filter?.container?.className,
                attributes: this._config.elements?.filter?.filter?.container?.attributes,
            });

            // Create and append label
            filterContainerElement.appendChild(
                createElement("span", {
                    innerHTML: filter.label ?? filter.columnName,
                    className: this._config.elements?.filter?.filter?.label?.className,
                    attributes: this._config.elements?.filter?.filter?.label?.attributes,
                })
            );

            if (filter.type === "select") {
                const filterElement = createElement("select", {
                    name: `ft-filter-${ filter.columnName }`,
                    className: this._config.elements?.filter?.filter?.select?.select?.className,
                    attributes: this._config.elements?.filter?.filter?.select?.select?.attributes,
                });

                // Add null value if it does not exist
                if (!filter.values.includes(null)) {
                    filter.values.unshift(null);
                }

                filter.values.forEach((value) => {
                    filterElement.appendChild(
                        createElement("option", {
                            value: value ? value : "ALL",
                            innerText: value ? value : this._config.components.filter?.allLabel,
                            className: this._config.elements?.filter?.filter?.select?.option?.className,
                            attributes: this._config.elements?.filter?.filter?.select?.option?.attributes,
                        })
                    );
                });

                filterElement.addEventListener("change", () => {
                    if (!this._isLoading) {
                        if (this._config.debug) console.info(`[Filter Component] Changing filter value of column ${ filter.columnName } to ${ filterElement.value }`);

                        if (filterElement.value === "ALL") {
                            this._eventDispatcher.dispatch("filter-value-change", null);
                            this._client.removeFilter(filter.columnName);
                        } else {
                            const currentFilter: Filter = { columnName: filter.columnName, value: filterElement.value };

                            this._eventDispatcher.dispatch("filter-value-change", currentFilter);
                            this._client.addFilter(currentFilter, true);
                            this._client.refresh();
                        }

                        this._client.refresh();
                    }
                });

                filterContainerElement.appendChild(filterElement);
            } else {
                const filterElement = createElement("div", {
                    className: this._config.elements?.filter?.filter?.button?.container?.className,
                    attributes: this._config.elements?.filter?.filter?.button?.container?.attributes,
                });

                // Add null value if it does not exist
                if (!filter.values.includes(null)) {
                    filter.values.unshift(null);
                }

                filter.values.forEach((value) => {
                    const buttonElement = createElement("button", {
                        type: "button",
                        innerText: value ? value : this._config.components.filter?.allLabel,
                        className: value === null ? this._config.elements?.filter?.filter?.button?.button?.active?.className : this._config.elements?.filter?.filter?.button?.button?.default?.className,
                        attributes: value === null ? this._config.elements?.filter?.filter?.button?.button?.active?.attributes : this._config.elements?.filter?.filter?.button?.button?.default?.attributes,
                    });

                    // Register event listener to buttonElement
                    buttonElement.addEventListener("click", () => {
                        if (!this._isLoading) {
                            if (this._config.debug) console.info(`[Filter Component] Changing filter value of column ${ filter.columnName } to ${ value }`);

                            // TODO: Refactor this
                            // We need to reset active class in every button before set active state to this one
                            const buttons = filterElement.querySelectorAll("button");
                            buttons.forEach((button) => {
                                button.className = this._config.elements?.filter?.filter?.button?.button?.default?.className ?? "";

                                Object.entries(this._config.elements?.filter?.filter?.button?.button?.default?.attributes ?? {}).forEach(([key, value]) => {
                                    button.removeAttribute(key);
                                });
                            });

                            buttonElement.className = this._config.elements?.filter?.filter?.button?.button?.active?.className ?? "";
                            Object.entries(this._config.elements?.filter?.filter?.button?.button?.active?.attributes ?? {}).forEach(([key, value]) => {
                                buttonElement.setAttribute(key, value);
                            });

                            if (value === null) {
                                this._eventDispatcher.dispatch("filter-value-change", null);
                                this._client.removeFilter(filter.columnName);
                                this._client.refresh();
                            } else {
                                const currentFilter: Filter = { columnName: filter.columnName, value: value };

                                this._eventDispatcher.dispatch("filter-value-change", currentFilter);
                                this._client.addFilter(currentFilter, true);
                                this._client.refresh();
                            }
                        }
                    });

                    filterElement.appendChild(buttonElement);
                });

                filterContainerElement.appendChild(filterElement);
            }

            containerElement.appendChild(filterContainerElement);
        });

        this._coreElement.appendChild(containerElement);
    }
}
