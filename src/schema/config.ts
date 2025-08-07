import { z } from "zod/mini";
import { columnSchema } from "./column";

export const configSchema = z.object({
    "ajaxURL": z.string(),
    "ajaxMethod": z._default(z.enum(["GET", "POST"]), "GET"),
    "ajaxHeaders": z._default(z.record(z.string(), z.string()), {
        "Content-Type": "application/json",
        "X-Requested-By": "ajax-table"
    }),
    "debug": z._default(z.boolean(), false),
    "columns": z.array(columnSchema),
    "elements": z.optional(z.object({
        "container": z.optional(z.object({
            "container": z.optional(z.object({
                "className": z.optional(z.string()),
                "querySelector": z.optional(z.string()),
                "attributes": z.optional(z.record(z.string(), z.string())),
            })),
            "header": z.optional(z.object({
                "className": z.optional(z.string()),
                "querySelector": z.optional(z.string()),
                "attributes": z.optional(z.record(z.string(), z.string())),
            })),
            "footer": z.optional(z.object({
                "className": z.optional(z.string()),
                "querySelector": z.optional(z.string()),
                "attributes": z.optional(z.record(z.string(), z.string())),
            })),
        })),
        "table": z.optional(z.object({
            "table": z.optional(z.object({
                "className": z.optional(z.string()),
                "attributes": z.optional(z.record(z.string(), z.string())),
            })),
            "tableHead": z.optional(z.object({
                "tableHead": z.optional(z.object({
                    "className": z.optional(z.string()),
                    "attributes": z.optional(z.record(z.string(), z.string())),
                })),
                "tableRow": z.optional(z.object({
                    "className": z.optional(z.string()),
                    "attributes": z.optional(z.record(z.string(), z.string())),
                })),
                "tableCell": z.optional(z.object({
                    "className": z.optional(z.string()),
                    "attributes": z.optional(z.record(z.string(), z.string())),
                }))
            })),
            "tableBody": z.optional(z.object({
                "tableBody": z.optional(z.object({
                    "className": z.optional(z.string()),
                    "attributes": z.optional(z.record(z.string(), z.string())),
                })),
                "tableRow": z.optional(z.object({
                    "className": z.optional(z.string()),
                    "attributes": z.optional(z.record(z.string(), z.string())),
                })),
                "tableCell": z.optional(z.object({
                    "className": z.optional(z.string()),
                    "attributes": z.optional(z.record(z.string(), z.string())),
                }))
            })),
            "placeholder": z.optional(z.object({
                "className": z.optional(z.string()),
                "innerHTML": z.optional(z.string()),
                "attributes": z.optional(z.record(z.string(), z.string())),
            }))
        })),
        "pagination": z.optional(z.object({
            "container": z.optional(z.object({
                "className": z.optional(z.string()),
                "attributes": z.optional(z.record(z.string(), z.string())),
            })),
            "button": z.optional(z.object({
                "primary": z.optional(z.object({
                    "className": z.optional(z.string()),
                    "attributes": z.optional(z.record(z.string(), z.string())),
                })),
                "active": z.optional(z.object({
                    "className": z.optional(z.string()),
                    "attributes": z.optional(z.record(z.string(), z.string())),
                })),
                "ellipsis": z.optional(z.object({
                    "className": z.optional(z.string()),
                    "innerHTML": z.optional(z.string()),
                    "attributes": z.optional(z.record(z.string(), z.string())),
                })),
                "previous": z.optional(z.object({
                    "className": z.optional(z.string()),
                    "innerHTML": z.optional(z.string()),
                    "attributes": z.optional(z.record(z.string(), z.string())),
                })),
                "next": z.optional(z.object({
                    "className": z.optional(z.string()),
                    "innerHTML": z.optional(z.string()),
                    "attributes": z.optional(z.record(z.string(), z.string())),
                })),
            })),
            "sizeSelector": z.optional(z.object({
                "container": z.optional(z.object({
                    "className": z.optional(z.string()),
                    "attributes": z.optional(z.record(z.string(), z.string())),
                })),
                "select": z.optional(z.object({
                    "className": z.optional(z.string()),
                    "attributes": z.optional(z.record(z.string(), z.string())),
                })),
                "option": z.optional(z.object({
                    "className": z.optional(z.string()),
                    "attributes": z.optional(z.record(z.string(), z.string())),
                }))
            }))
        })),
        "search": z.optional(z.object({
            "container": z.optional(z.object({
                "className": z.optional(z.string()),
                "attributes": z.optional(z.record(z.string(), z.string())),
            })),
            "input": z.optional(z.object({
                "className": z.optional(z.string()),
                "attributes": z.optional(z.record(z.string(), z.string())),
            }))
        })),
    })),
    "components": z.optional(z.object({
        "pagination": z.optional(z.object({
            "active": z._default(z.boolean(), false),
            "pageSize": z._default(z.number(), 25),
            "availableSizes": z._default(z.array(z.number()), [10, 25, 50, 100]),
            "style": z._default(z.enum(["standard", "simple"]), "standard"),
        }))
    })),
});

export type ConfigSchema = z.infer<typeof configSchema>;
