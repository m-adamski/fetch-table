import Component from "./component";
import { ConfigSchema } from "../schema/config";
import EventDispatcher from "../modules/event-dispatcher";
import Client from "../modules/client";
export default class TableComponent extends Component {
    private _sort;
    private _elements;
    constructor(coreElement: HTMLElement, config: ConfigSchema, eventDispatcher: EventDispatcher, client: Client);
    /**
     * Initializes the table component by creating and appending the table's core elements,
     * including the table, header, and body, as well as setting up column headers and sorting behavior.
     */
    private init;
    /**
     * Renders the table data to the body element of the table component.
     * Validates the required elements' presence and updates the DOM based on the provided data.
     * Throws an error if the body element is not initialized or if column data is missing.
     *
     * @param data
     * @private
     */
    private render;
}
