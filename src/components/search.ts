import Component from "./component";
import { ConfigSchema } from "../schema/config";
import { createElement } from "../utils/create-element";
import EventDispatcher from "../modules/event-dispatcher";
import Client from "../modules/client";

export default class SearchComponent extends Component {
    private _isLoading: boolean = false;

    constructor(coreElement: HTMLElement, config: ConfigSchema, eventDispatcher: EventDispatcher, client: Client) {
        super(coreElement, config, eventDispatcher, client);

        // Register event handlers
        this._eventDispatcher.register("before-data-fetch", () => this._isLoading = true);
        this._eventDispatcher.register("after-data-fetch", () => this._isLoading = false);

        this.init();
    }

    private init(): void {
        if (this._config.debug) console.info("[Search Component] Initializing..");

        this._coreElement.innerHTML = "";

        const containerElement = createElement("div", {
            className: this._config.elements?.search?.container?.className,
            attributes: this._config.elements?.search?.container?.attributes,
        });

        const inputElement = createElement("input", {
            type: "text",
            className: this._config.elements?.search?.input?.className,
            attributes: this._config.elements?.search?.input?.attributes,
        });

        let inputTimeout: any = null;
        inputElement.addEventListener("keyup", () => {
            if (!this._isLoading) {
                clearTimeout(inputTimeout);

                inputTimeout = setTimeout(() => {
                    if (this._config.debug) console.info(`[Search Component] Searching for "${ inputElement.value }"`);

                    // Get search query, dispatch event and refresh data
                    let searchQuery: string = inputElement.value;

                    this._eventDispatcher.dispatch("search-change", searchQuery);
                    this._client.search = searchQuery;
                    this._client.refresh();
                }, 500);
            }
        });

        containerElement.appendChild(inputElement);
        this._coreElement.appendChild(containerElement);
    }
}
