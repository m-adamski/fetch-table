import { ConfigSchema } from "../schema/config";
import { ResponseSchema, responseSchema } from "../schema/response";
import { Sort } from "../interfaces/sort";
import EventDispatcher from "./event-dispatcher";

export default class Client {
    private readonly _config: ConfigSchema;
    private readonly _eventDispatcher: EventDispatcher;

    public constructor(config: ConfigSchema, eventDispatcher: EventDispatcher) {
        this._config = config;
        this._eventDispatcher = eventDispatcher;
    }

    public refresh(sort: Sort | null = null): void {
        if (this._config.debug) console.info("Refreshing data..");

        // Dispatch event
        this._eventDispatcher.dispatch("before-data-refresh");

        fetch(this._config.ajaxURL + "?" + (this.generateURLSearchParams(sort) || ""), {
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

    private generateURLSearchParams(sort: Sort | null): URLSearchParams | null {
        if (sort !== null) {
            return new URLSearchParams({
                "sort-column": sort.column.name,
                "sort-direction": sort.direction,
            });
        }

        return null;
    }
};
