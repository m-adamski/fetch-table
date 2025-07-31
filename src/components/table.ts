import { Component } from "../interfaces/component";
import { ConfigSchema } from "../schema/config";
import { ResponseSchema } from "../schema/response";
import { ColumnSchema } from "../schema/column";
import EventDispatcher from "../modules/event-dispatcher";
import Client from "../modules/client";

export default class TableComponent implements Component {
    private readonly _config: ConfigSchema;
    private readonly _coreElement: HTMLElement;
    private readonly _eventDispatcher: EventDispatcher;
    private readonly _client: Client;

    private _isLoading: boolean = false;
    private _sort: { column: ColumnSchema, direction: "ASC" | "DESC" } | null = null;
    private _elements: { table: HTMLElement | null, head: HTMLElement | null, body: HTMLElement | null } = {
        table: null,
        head: null,
        body: null
    }

    public constructor(coreElement: HTMLElement, config: ConfigSchema, eventDispatcher: EventDispatcher, client: Client) {
        this._config = config;
        this._coreElement = coreElement;
        this._eventDispatcher = eventDispatcher;
        this._client = client;

        // Register event handlers
        this._eventDispatcher.register("before-data-refresh", () => this._isLoading = true);
        this._eventDispatcher.register("data-refresh", (data) => this.render(data));
        this._eventDispatcher.register("after-data-refresh", () => this._isLoading = false);

        this.init();
    }

    private init(): void {
        this._coreElement.innerHTML = "";

        // Create core elements
        this._elements.table = document.createElement("table");
        this._elements.head = document.createElement("thead");
        this._elements.body = document.createElement("tbody");

        this._elements.table.className = this._config.classNames?.table?.table || "";
        this._elements.body.className = this._config.classNames?.table?.body || "";

        // Create header cells
        const columnRow = document.createElement("tr");
        this._config.columns.forEach(column => {
            const columnElement = document.createElement("th");
            columnElement.innerText = column.label;
            columnElement.className = column.className || "";
            columnElement.setAttribute("scope", "col");

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
                        this._client.refresh(this._sort);
                    }
                });
            }

            columnRow.appendChild(columnElement);
        });

        this._elements.head.appendChild(columnRow);
        this._elements.table.appendChild(this._elements.head);
        this._elements.table.appendChild(this._elements.body);

        this._coreElement.appendChild(this._elements.table);
    }

    private render(data: ResponseSchema): void {
        if (this._config.debug) console.info("[Table Component] Rendering data..");

        if (this._elements.body === null) {
            throw new Error("[Table Component] Body element couldn't be found.")
        }

        this._elements.body.innerHTML = "";

        if (data.data.length === 0 && this._config.placeholder !== undefined && this._config.placeholder !== null && this._config.placeholder !== "") {
            const placeholderElement = document.createElement("tr");
            const placeholderCellElement = document.createElement("td");
            placeholderCellElement.innerText = this._config.placeholder;
            placeholderCellElement.className = this._config.classNames?.table?.placeholder || "";
            placeholderCellElement.setAttribute("colspan", `${ this._config.columns.length }`);

            placeholderElement.appendChild(placeholderCellElement);
            this._elements.body?.appendChild(placeholderElement);
        } else {

            data.data.forEach(dataItem => {
                const rowElement = document.createElement("tr");

                this._config.columns.forEach(column => {
                    const item = dataItem.find(function (item) {
                        return item.column === column.name;
                    });

                    if (item === undefined) {
                        throw new Error(`[Table Component] Column ${ column.name } not found`);
                    }

                    const columnElement = document.createElement("td");
                    columnElement.innerText = item.value;
                    columnElement.className = item.className || "";

                    rowElement.appendChild(columnElement);
                });

                this._elements.body?.appendChild(rowElement);
            });
        }
    }
}
