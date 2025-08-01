type ElementAttributes = Partial<HTMLElement>;

// Inspired by TS Dom Utils
// https://github.com/rafaucau/ts-dom-utils/tree/main
interface CreateElementOptions<K extends keyof HTMLElementTagNameMap> {
    [key: string]: any;
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    options: CreateElementOptions<K> = {}
): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName);

    Object.entries(options).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (key in element) {
            (element as any)[key] = value;
        } else {
            element.setAttribute(key, String(value));
        }
    });

    return element;
}
