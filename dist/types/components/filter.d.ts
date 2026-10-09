import Component from "./component";
import { ConfigSchema } from "../schema/config";
import EventDispatcher from "../modules/event-dispatcher";
import Client from "../modules/client";
export default class FilterComponent extends Component {
    constructor(coreElement: HTMLElement, config: ConfigSchema, eventDispatcher: EventDispatcher, client: Client);
    private init;
}
