import { z } from "zod/mini";
export declare const configSchema: z.ZodMiniObject<{
    ajaxURL: z.ZodMiniString<string>;
    ajaxMethod: z.ZodMiniEnum<{
        GET: "GET";
        POST: "POST";
    }>;
    ajaxHeaders: z.ZodMiniDefault<z.ZodMiniRecord<z.ZodMiniString<string>, z.ZodMiniString<string>>>;
    debug: z.ZodMiniDefault<z.ZodMiniBoolean<boolean>>;
    columns: z.ZodMiniRecord<z.ZodMiniString<string>, z.ZodMiniObject<{
        type: z.ZodMiniEnum<{
            text: "text";
            html: "html";
        }>;
        label: z.ZodMiniString<string>;
        className: z.ZodMiniOptional<z.ZodMiniString<string>>;
        sortable: z.ZodMiniBoolean<boolean>;
        searchable: z.ZodMiniBoolean<boolean>;
    }, z.core.$strip>>;
    elements: z.ZodMiniOptional<z.ZodMiniObject<{
        container: z.ZodMiniOptional<z.ZodMiniObject<{
            container: z.ZodMiniOptional<z.ZodMiniObject<{
                className: z.ZodMiniOptional<z.ZodMiniString<string>>;
                querySelector: z.ZodMiniOptional<z.ZodMiniString<string>>;
                attributes: z.ZodMiniOptional<z.ZodMiniRecord<z.ZodMiniString<string>, z.ZodMiniString<string>>>;
            }, z.core.$strip>>;
            header: z.ZodMiniOptional<z.ZodMiniObject<{
                className: z.ZodMiniOptional<z.ZodMiniString<string>>;
                querySelector: z.ZodMiniOptional<z.ZodMiniString<string>>;
                attributes: z.ZodMiniOptional<z.ZodMiniRecord<z.ZodMiniString<string>, z.ZodMiniString<string>>>;
            }, z.core.$strip>>;
            footer: z.ZodMiniOptional<z.ZodMiniObject<{
                className: z.ZodMiniOptional<z.ZodMiniString<string>>;
                querySelector: z.ZodMiniOptional<z.ZodMiniString<string>>;
                attributes: z.ZodMiniOptional<z.ZodMiniRecord<z.ZodMiniString<string>, z.ZodMiniString<string>>>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
        table: z.ZodMiniOptional<z.ZodMiniObject<{
            table: z.ZodMiniOptional<z.ZodMiniObject<{
                className: z.ZodMiniOptional<z.ZodMiniString<string>>;
                attributes: z.ZodMiniOptional<z.ZodMiniRecord<z.ZodMiniString<string>, z.ZodMiniString<string>>>;
            }, z.core.$strip>>;
            tableHead: z.ZodMiniOptional<z.ZodMiniObject<{
                tableHead: z.ZodMiniOptional<z.ZodMiniObject<{
                    className: z.ZodMiniOptional<z.ZodMiniString<string>>;
                    attributes: z.ZodMiniOptional<z.ZodMiniRecord<z.ZodMiniString<string>, z.ZodMiniString<string>>>;
                }, z.core.$strip>>;
                tableRow: z.ZodMiniOptional<z.ZodMiniObject<{
                    className: z.ZodMiniOptional<z.ZodMiniString<string>>;
                    attributes: z.ZodMiniOptional<z.ZodMiniRecord<z.ZodMiniString<string>, z.ZodMiniString<string>>>;
                }, z.core.$strip>>;
                tableCell: z.ZodMiniOptional<z.ZodMiniObject<{
                    className: z.ZodMiniOptional<z.ZodMiniString<string>>;
                    attributes: z.ZodMiniOptional<z.ZodMiniRecord<z.ZodMiniString<string>, z.ZodMiniString<string>>>;
                }, z.core.$strip>>;
            }, z.core.$strip>>;
            tableBody: z.ZodMiniOptional<z.ZodMiniObject<{
                tableBody: z.ZodMiniOptional<z.ZodMiniObject<{
                    className: z.ZodMiniOptional<z.ZodMiniString<string>>;
                    attributes: z.ZodMiniOptional<z.ZodMiniRecord<z.ZodMiniString<string>, z.ZodMiniString<string>>>;
                }, z.core.$strip>>;
                tableRow: z.ZodMiniOptional<z.ZodMiniObject<{
                    className: z.ZodMiniOptional<z.ZodMiniString<string>>;
                    attributes: z.ZodMiniOptional<z.ZodMiniRecord<z.ZodMiniString<string>, z.ZodMiniString<string>>>;
                }, z.core.$strip>>;
                tableCell: z.ZodMiniOptional<z.ZodMiniObject<{
                    className: z.ZodMiniOptional<z.ZodMiniString<string>>;
                    attributes: z.ZodMiniOptional<z.ZodMiniRecord<z.ZodMiniString<string>, z.ZodMiniString<string>>>;
                }, z.core.$strip>>;
            }, z.core.$strip>>;
            placeholder: z.ZodMiniOptional<z.ZodMiniObject<{
                className: z.ZodMiniOptional<z.ZodMiniString<string>>;
                innerHTML: z.ZodMiniOptional<z.ZodMiniString<string>>;
                attributes: z.ZodMiniOptional<z.ZodMiniRecord<z.ZodMiniString<string>, z.ZodMiniString<string>>>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
        pagination: z.ZodMiniOptional<z.ZodMiniObject<{
            container: z.ZodMiniOptional<z.ZodMiniObject<{
                className: z.ZodMiniOptional<z.ZodMiniString<string>>;
                attributes: z.ZodMiniOptional<z.ZodMiniRecord<z.ZodMiniString<string>, z.ZodMiniString<string>>>;
            }, z.core.$strip>>;
            button: z.ZodMiniOptional<z.ZodMiniObject<{
                primary: z.ZodMiniOptional<z.ZodMiniObject<{
                    className: z.ZodMiniOptional<z.ZodMiniString<string>>;
                    attributes: z.ZodMiniOptional<z.ZodMiniRecord<z.ZodMiniString<string>, z.ZodMiniString<string>>>;
                }, z.core.$strip>>;
                active: z.ZodMiniOptional<z.ZodMiniObject<{
                    className: z.ZodMiniOptional<z.ZodMiniString<string>>;
                    attributes: z.ZodMiniOptional<z.ZodMiniRecord<z.ZodMiniString<string>, z.ZodMiniString<string>>>;
                }, z.core.$strip>>;
                ellipsis: z.ZodMiniOptional<z.ZodMiniObject<{
                    className: z.ZodMiniOptional<z.ZodMiniString<string>>;
                    innerHTML: z.ZodMiniOptional<z.ZodMiniString<string>>;
                    attributes: z.ZodMiniOptional<z.ZodMiniRecord<z.ZodMiniString<string>, z.ZodMiniString<string>>>;
                }, z.core.$strip>>;
                previous: z.ZodMiniOptional<z.ZodMiniObject<{
                    className: z.ZodMiniOptional<z.ZodMiniString<string>>;
                    innerHTML: z.ZodMiniOptional<z.ZodMiniString<string>>;
                    attributes: z.ZodMiniOptional<z.ZodMiniRecord<z.ZodMiniString<string>, z.ZodMiniString<string>>>;
                }, z.core.$strip>>;
                next: z.ZodMiniOptional<z.ZodMiniObject<{
                    className: z.ZodMiniOptional<z.ZodMiniString<string>>;
                    innerHTML: z.ZodMiniOptional<z.ZodMiniString<string>>;
                    attributes: z.ZodMiniOptional<z.ZodMiniRecord<z.ZodMiniString<string>, z.ZodMiniString<string>>>;
                }, z.core.$strip>>;
            }, z.core.$strip>>;
            sizeSelector: z.ZodMiniOptional<z.ZodMiniObject<{
                container: z.ZodMiniOptional<z.ZodMiniObject<{
                    className: z.ZodMiniOptional<z.ZodMiniString<string>>;
                    attributes: z.ZodMiniOptional<z.ZodMiniRecord<z.ZodMiniString<string>, z.ZodMiniString<string>>>;
                }, z.core.$strip>>;
                select: z.ZodMiniOptional<z.ZodMiniObject<{
                    className: z.ZodMiniOptional<z.ZodMiniString<string>>;
                    attributes: z.ZodMiniOptional<z.ZodMiniRecord<z.ZodMiniString<string>, z.ZodMiniString<string>>>;
                }, z.core.$strip>>;
                option: z.ZodMiniOptional<z.ZodMiniObject<{
                    className: z.ZodMiniOptional<z.ZodMiniString<string>>;
                    attributes: z.ZodMiniOptional<z.ZodMiniRecord<z.ZodMiniString<string>, z.ZodMiniString<string>>>;
                }, z.core.$strip>>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
        search: z.ZodMiniOptional<z.ZodMiniObject<{
            container: z.ZodMiniOptional<z.ZodMiniObject<{
                className: z.ZodMiniOptional<z.ZodMiniString<string>>;
                attributes: z.ZodMiniOptional<z.ZodMiniRecord<z.ZodMiniString<string>, z.ZodMiniString<string>>>;
            }, z.core.$strip>>;
            input: z.ZodMiniOptional<z.ZodMiniObject<{
                className: z.ZodMiniOptional<z.ZodMiniString<string>>;
                attributes: z.ZodMiniOptional<z.ZodMiniRecord<z.ZodMiniString<string>, z.ZodMiniString<string>>>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    components: z.ZodMiniObject<{
        pagination: z.ZodMiniObject<{
            active: z.ZodMiniBoolean<boolean>;
            pageSize: z.ZodMiniNumber<number>;
            availableSizes: z.ZodMiniArray<z.ZodMiniNumber<number>>;
            style: z.ZodMiniEnum<{
                standard: "standard";
                simple: "simple";
            }>;
        }, z.core.$strip>;
        search: z.ZodMiniObject<{
            active: z.ZodMiniBoolean<boolean>;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type ConfigSchema = z.infer<typeof configSchema>;
