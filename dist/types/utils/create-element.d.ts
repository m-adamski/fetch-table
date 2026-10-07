interface CreateElementOptions<K extends keyof HTMLElementTagNameMap> {
    [key: string]: any;
}
export declare function createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: CreateElementOptions<K>): HTMLElementTagNameMap[K];
export {};
