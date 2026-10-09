import { Component as ComponentInterface } from "../interfaces/component";
import { ConfigSchema } from "../schema/config";
import EventDispatcher from "../modules/event-dispatcher";
import Client from "../modules/client";

export default class Component implements ComponentInterface {
    protected readonly _config: ConfigSchema;
    protected readonly _coreElement: HTMLElement;
    protected readonly _eventDispatcher: EventDispatcher;
    protected readonly _client: Client;

    protected _isLoading: boolean = false;

    constructor(coreElement: HTMLElement, config: ConfigSchema, eventDispatcher: EventDispatcher, client: Client) {
        this._config = config;
        this._coreElement = coreElement;
        this._eventDispatcher = eventDispatcher;
        this._client = client;

        // Register event handlers
        this._eventDispatcher.register("before-data-fetch", () => this._isLoading = true);
        this._eventDispatcher.register("after-data-fetch", () => this._isLoading = false);
    }
}
