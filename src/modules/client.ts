import { ConfigSchema } from "../schema/config";
import { ResponseSchema, responseSchema } from "../schema/response";
import { Sort } from "../interfaces/sort";
import { Pagination } from "../interfaces/pagination";
import EventDispatcher from "./event-dispatcher";

export default class Client {
    private readonly _config: ConfigSchema;
    private readonly _eventDispatcher: EventDispatcher;

    private _sort: Sort | null = null;
    private _pagination: Pagination | null = null;

    constructor(config: ConfigSchema, eventDispatcher: EventDispatcher) {
        this._config = config;
        this._eventDispatcher = eventDispatcher;
    }

    /**
     * Refreshes data by triggering an AJAX request to the configured URL.
     * Handles the data response and dispatches appropriate events in the process,
     * including "before-data-refresh", "data-refresh", "after-data-refresh", and "data-refresh-error".
     */
    public refresh(): void {
        if (this._config.debug) console.info("Refreshing data..");

        // Dispatch event
        this._eventDispatcher.dispatch("before-data-refresh");

        fetch(this._config.ajaxURL + "?" + this.generateURLSearchParams(), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-By": "ajax-table"
            }
        }).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    const responseData: ResponseSchema = responseSchema.parse(data);

                    // Dispatch event
                    this._eventDispatcher.dispatch("data-refresh", responseData);
                    this._eventDispatcher.dispatch("after-data-refresh");
                }).catch(error => {
                    if (this._config.debug) console.error(error);
                    this._eventDispatcher.dispatch("data-refresh-error", { error: error });
                    this._eventDispatcher.dispatch("after-data-refresh");
                });
            }
        }).catch(error => {
            if (this._config.debug) console.error(error);
            this._eventDispatcher.dispatch("data-refresh-error", { error: error });
            this._eventDispatcher.dispatch("after-data-refresh");
        });
    }

    get sort(): Sort | null {
        return this._sort;
    }

    set sort(value: Sort | null) {
        this._sort = value;
    }

    get pagination(): Pagination | null {
        return this._pagination;
    }

    set pagination(value: Pagination | null) {
        this._pagination = value;
    }

    /**
     * Generates and returns URL search parameters based on the current pagination and sort settings.
     *
     * If pagination details are available, they are added as "pagination-page" and "pagination-size" parameters.
     * If sorting details are specified, they are added as "sort-column" and "sort-direction" parameters.
     *
     * @return {URLSearchParams}
     */
    private generateURLSearchParams(): URLSearchParams {
        let params = new URLSearchParams();

        if (this._pagination !== null) {
            params.append("pagination-page", this._pagination.page.toString());
            params.append("pagination-size", this._pagination.pageSize.toString());
        }

        if (this._sort !== null) {
            params.append("sort-column", this._sort.column.name);
            params.append("sort-direction", this._sort.direction);
        }

        return params;
    }
};
