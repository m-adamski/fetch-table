import Component from "./component";
import { ConfigSchema } from "../schema/config";
import { ResponseSchema } from "../schema/response";
import { Pagination } from "../interfaces/pagination";
import { createElement } from "../utils/create-element";
import EventDispatcher from "../modules/event-dispatcher";
import Client from "../modules/client";

export default class PaginationComponent extends Component {
    private _isLoading: boolean = false;
    private _elements: {
        container: HTMLElement | null,
        sizeContainer: HTMLElement | null,
        sizeSelect: HTMLSelectElement | null
    } = {
        container: null,
        sizeContainer: null,
        sizeSelect: null
    }

    constructor(coreElement: HTMLElement, config: ConfigSchema, eventDispatcher: EventDispatcher, client: Client) {
        super(coreElement, config, eventDispatcher, client);

        // Register event handlers
        this._eventDispatcher.register("before-data-fetch", () => this._isLoading = true);
        this._eventDispatcher.register("data-fetch", (data) => this.render(data));
        this._eventDispatcher.register("after-data-fetch", () => this._isLoading = false);

        this.init();
    }

    /**
     * Initializes the pagination component by setting up its core container and clearing existing content.
     * This method creates a navigation container element with the specified class name and ARIA label,
     * then appends it to the core element of the component.
     */
    private init(): void {
        if (this._config.debug) console.info("[Pagination Component] Initializing..");

        this._coreElement.innerHTML = "";

        this._elements.container = createElement("nav", {
            className: this._config.elements?.pagination?.container?.className,
            attributes: this._config.elements?.pagination?.container?.attributes,
            ariaLabel: "Pagination"
        });

        this._elements.sizeContainer = createElement("div", {
            className: this._config.elements?.pagination?.sizeSelector?.container?.className,
            attributes: this._config.elements?.pagination?.sizeSelector?.container?.attributes
        });

        const sizeSelectElement = createElement("select", {
            name: "at-size-selector",
            className: this._config.elements?.pagination?.sizeSelector?.select?.className,
            attributes: this._config.elements?.pagination?.sizeSelector?.select?.attributes
        });

        this._config.components?.pagination?.availableSizes?.forEach(size => {
            const optionElement = createElement("option", {
                value: size,
                innerText: size.toString(),
                selected: size === this._client.pagination?.pageSize ? "selected" : null,
            });

            sizeSelectElement.appendChild(optionElement);
        });

        sizeSelectElement.addEventListener("change", () => {
            if (!this._isLoading) {
                if (this._config.debug) console.info(`[Pagination Component] Changing page size to ${ sizeSelectElement.value }`);

                // Create the pagination object, dispatch event and refresh data
                let pagination: Pagination = {
                    page: 1,
                    pageSize: parseInt(sizeSelectElement.value)
                };

                this._eventDispatcher.dispatch("pagination-size-change", pagination);
                this._client.pagination = pagination;
                this._client.refresh();
            }
        });

        this._elements.sizeContainer.appendChild(sizeSelectElement);
        this._coreElement.appendChild(this._elements.sizeContainer);
        this._coreElement.appendChild(this._elements.container);
    }

    /**
     * Renders the pagination controls and initializes event listeners for navigating between pages.
     *
     * @param data
     * @private
     */
    private render(data: ResponseSchema): void {
        if (this._config.debug) console.info("[Pagination Component] Rendering data..");

        if (this._elements.container === null) {
            throw new Error("[Pagination Component] Container element couldn't be found. First, initialize the component with the init() method");
        }

        // Internal function to get the pagination data from the response
        const paginationData = (): { page: number, pageSize: number, totalPages: number } => {
            if (data.pagination === undefined) {
                throw new Error("[Pagination Component] Pagination data is missing. Please check your API response");
            }

            return data.pagination;
        }

        this._elements.container.innerText = "";

        const previousButtonElement = createElement("button", {
            className: this._config.elements?.pagination?.button?.previous?.className || this._config.elements?.pagination?.button?.primary?.className,
            attributes: this._config.elements?.pagination?.button?.previous?.attributes,
            innerHTML: this._config.elements?.pagination?.button?.previous?.innerHTML,
            disabled: paginationData().page === 1 ? "disabled" : null,
            type: "button"
        });

        previousButtonElement.addEventListener("click", () => {
            if (!this._isLoading) {
                if (paginationData().page > 1) {
                    if (this._config.debug) console.info(`[Pagination Component] Moving to the previous page`);

                    // Create the pagination object, dispatch event and refresh data
                    let pagination: Pagination = {
                        page: paginationData().page - 1,
                        pageSize: paginationData().pageSize
                    };

                    this._eventDispatcher.dispatch("pagination-change", pagination);
                    this._client.pagination = pagination;
                    this._client.refresh();
                }
            }
        });

        const nextButtonElement = createElement("button", {
            type: "button",
            className: this._config.elements?.pagination?.button?.next?.className || this._config.elements?.pagination?.button?.primary?.className,
            attributes: this._config.elements?.pagination?.button?.next?.attributes,
            innerHTML: this._config.elements?.pagination?.button?.next?.innerHTML,
            disabled: paginationData().page === paginationData().totalPages ? "disabled" : null
        });

        nextButtonElement.addEventListener("click", () => {
            if (!this._isLoading) {
                if (paginationData().page < paginationData().totalPages) {
                    if (this._config.debug) console.info(`[Pagination Component] Moving to the next page`);

                    // Create the pagination object, dispatch event and refresh data
                    let pagination: Pagination = {
                        page: paginationData().page + 1,
                        pageSize: paginationData().pageSize
                    }

                    this._eventDispatcher.dispatch("pagination-change", pagination);
                    this._client.pagination = pagination;
                    this._client.refresh();
                }
            }
        });

        // Create structure
        this._elements.container?.appendChild(previousButtonElement);

        if (this._config.components?.pagination?.style !== "simple") {

            /**
             * Internal function to create a button element with the specified page number and active state.
             *
             * @param pageNumber
             * @param isActive
             */
            const createButtonElement = (pageNumber: number, isActive: boolean = false) => {
                const buttonElement = createElement("button", {
                    className: isActive ? this._config.elements?.pagination?.button?.active?.className || this._config.elements?.pagination?.button?.primary?.className : this._config.elements?.pagination?.button?.primary?.className,
                    attributes: this._config.elements?.pagination?.button?.active?.attributes,
                    innerText: pageNumber.toString(),
                    type: "button"
                });

                buttonElement.addEventListener("click", () => {
                    if (!this._isLoading) {
                        if (this._config.debug) console.info(`[Pagination Component] Moving to page number: ${ pageNumber }`);

                        // Create the pagination object, dispatch event and refresh data
                        let pagination: Pagination = {
                            page: pageNumber,
                            pageSize: paginationData().pageSize
                        };

                        this._eventDispatcher.dispatch("pagination-change", pagination);
                        this._client.pagination = { page: pageNumber, pageSize: paginationData().pageSize };
                        this._client.refresh();
                    }
                });

                return buttonElement;
            }

            /**
             * Internal function to create an ellipsis element with the specified class name and HTML content.
             */
            const createEllipsisElement = () => {
                return createElement("span", {
                    className: this._config.elements?.pagination?.button?.ellipsis?.className || this._config.elements?.pagination?.button?.primary?.className,
                    attributes: this._config.elements?.pagination?.button?.previous?.attributes,
                    innerHTML: this._config.elements?.pagination?.button?.ellipsis?.innerHTML || "..",
                });
            }

            // Always show the first page button
            const firstButtonElement = createButtonElement(1, 1 === paginationData().page);
            this._elements.container?.appendChild(firstButtonElement);

            // Add ellipsis after the first page if needed (on page 5 or more)
            if (paginationData().page > 4) {
                this._elements.container?.appendChild(createEllipsisElement());
            }

            // Show pages around the current page
            // Example: 1 2 3 4 5 .. 20
            // Example: 1 .. 4 5 6 .. 20
            // Example: 1 .. 16 17 18 19 20
            if (paginationData().page < 5) {
                for (let i = 2; i <= Math.min(5, paginationData().totalPages - 1); i++) {
                    const buttonElement = createButtonElement(i, i === paginationData().page);
                    this._elements.container?.appendChild(buttonElement);
                }
            } else if (paginationData().page > paginationData().totalPages - 4) {
                for (let i = Math.max(paginationData().totalPages - 4, 2); i <= paginationData().totalPages - 1; i++) {
                    const buttonElement = createButtonElement(i, i === paginationData().page);
                    this._elements.container?.appendChild(buttonElement);
                }
            } else {
                for (let i = paginationData().page - 1; i <= paginationData().page + 1; i++) {
                    const buttonElement = createButtonElement(i, i === paginationData().page);
                    this._elements.container?.appendChild(buttonElement);
                }
            }

            // Add ellipsis before the last page if needed
            if (paginationData().page <= paginationData().totalPages - 4) {
                this._elements.container?.appendChild(createEllipsisElement());
            }

            // Show the last page button when there are more pages than 1
            if (paginationData().totalPages > 1) {
                const lastButton = createButtonElement(paginationData().totalPages, paginationData().totalPages === paginationData().page);
                this._elements.container?.appendChild(lastButton);
            }
        }

        this._elements.container?.appendChild(nextButtonElement);
    }
}
