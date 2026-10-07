import Component from "./component";
import { ConfigSchema } from "../schema/config";
import EventDispatcher from "../modules/event-dispatcher";
import Client from "../modules/client";
export default class PaginationComponent extends Component {
    private _isLoading;
    private _elements;
    constructor(coreElement: HTMLElement, config: ConfigSchema, eventDispatcher: EventDispatcher, client: Client);
    /**
     * Initializes the pagination component by setting up its core container and clearing existing content.
     * This method creates a navigation container element with the specified class name and ARIA label,
     * then appends it to the core element of the component.
     */
    private init;
    /**
     * Renders the pagination controls and initializes event listeners for navigating between pages.
     *
     * @param data
     * @private
     */
    private render;
}
