import { z } from "zod";
import { ConfigSchema } from "./schema/config";

export default class Table {
    private readonly config: ConfigSchema;
    private readonly coreElement: HTMLElement;

    constructor(element: string, config: ConfigSchema) {
        this.config = this.validateConfig(config);
        this.coreElement = document.querySelector(element);

        this.renderCore();
    }

    private validateConfig(config: ConfigSchema) {
        return z.object({
            "ajaxURL": z.string()
        }).parse(config);
    }

    private renderCore() {
        this.coreElement.innerHTML = "";
    }
};
