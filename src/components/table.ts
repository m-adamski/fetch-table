import Component from "./component";
import { ConfigSchema } from "../schema/config";
import { ResponseSchema } from "../schema/response";
import { ColumnSchema } from "../schema/column";
import { createElement } from "../utils/create-element";
import EventDispatcher from "../modules/event-dispatcher";
import Client from "../modules/client";

export default class TableComponent extends Component {
    private _isLoading: boolean = false;
    private _sort: { column: ColumnSchema, direction: "ASC" | "DESC" } | null = null;
    private _elements: { table: HTMLElement | null, head: HTMLElement | null, body: HTMLElement | null } = {
        table: null,
        head: null,
        body: null
    }

    constructor(coreElement: HTMLElement, config: ConfigSchema, eventDispatcher: EventDispatcher, client: Client) {
        super(coreElement, config, eventDispatcher, client);

        // Register event handlers
        this._eventDispatcher.register("before-data-refresh", () => this._isLoading = true);
        this._eventDispatcher.register("data-refresh", (data) => this.render(data));
        this._eventDispatcher.register("after-data-refresh", () => this._isLoading = false);

        this.init();
    }

    /**
     * Initializes the table component by creating and appending the table's core elements,
     * including the table, header, and body, as well as setting up column headers and sorting behavior.
     */
    private init(): void {
        this._coreElement.innerHTML = "";

        // Create core elements
        this._elements.table = createElement("table", {
            className: this._config.classNames?.table?.table
        });

        this._elements.head = createElement("thead", {
            className: this._config.classNames?.table?.head.container
        });

        this._elements.body = createElement("tbody", {
            className: this._config.classNames?.table?.body.container
        });

        // Create header cells
        const columnRowElement = createElement("tr", {
            className: this._config.classNames?.table?.head.row
        });

        this._config.columns.forEach(column => {
            const columnElement = createElement("th", {
                scope: "col",
                className: column.className || this._config.classNames?.table?.head.cell,
                innerText: column.label
            });

            if (column.sortable) {
                columnElement.addEventListener("click", () => {
                    if (!this._isLoading) {
                        if (this._config.debug) console.info(`[Table Component] Sort by column: ${ column.name }`);

                        // Define sort object
                        if (this._sort === null) {
                            this._sort = { column: column, direction: "ASC" };
                        } else {
                            if (this._sort.column.name === column.name) {
                                this._sort.direction = this._sort.direction === "ASC" ? "DESC" : "ASC";
                            } else {
                                this._sort = { column: column, direction: "ASC" };
                            }
                        }

                        // Refresh
                        this._client.sort = this._sort;
                        this._client.refresh();
                    }
                });
            }

            columnRowElement.appendChild(columnElement);
        });

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
    private render(data: ResponseSchema): void {
        if (this._config.debug) console.info("[Table Component] Rendering data..");

        if (this._elements.body === null) {
            throw new Error("[Table Component] Body element couldn't be found. First, initialize the component with the init() method.")
        }

        this._elements.body.innerHTML = "";

        if (data.data.length === 0 && this._config.placeholder !== undefined && this._config.placeholder !== null && this._config.placeholder !== "") {
            const placeholderElement = createElement("tr", {
                className: this._config.classNames?.table?.body.row
            });

            const placeholderCellElement = createElement("td", {
                colSpan: this._config.columns.length,
                className: this._config.classNames?.table?.placeholder || this._config.classNames?.table?.body.cell,
                innerText: this._config.placeholder
            })

            placeholderElement.appendChild(placeholderCellElement);
            this._elements.body?.appendChild(placeholderElement);
        } else {

            data.data.forEach(dataItem => {
                const rowElement = createElement("tr", {
                    className: this._config.classNames?.table?.body.row
                });

                this._config.columns.forEach(column => {
                    const item = dataItem.find(function (item) {
                        return item.column === column.name;
                    });

                    if (item === undefined) {
                        throw new Error(`[Table Component] Column ${ column.name } not found`);
                    }

                    const columnElement = createElement("td", {
                        className: item.className || this._config.classNames?.table?.body.cell,
                        innerText: item.value
                    });

                    rowElement.appendChild(columnElement);
                });

                this._elements.body?.appendChild(rowElement);
            });
        }
    }
}
