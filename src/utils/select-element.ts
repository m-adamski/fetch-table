/**
 * Selects an element from the document based on the provided query selector.
 * Returns null if the element is not found or the query selector is empty.
 *
 * @param querySelector
 */
export function selectElement(querySelector: string | null | undefined): HTMLElement | null {
    if (querySelector !== null && querySelector !== undefined && querySelector !== "") {
        return document.querySelector(querySelector) as HTMLElement;
    }

    return null;
}
