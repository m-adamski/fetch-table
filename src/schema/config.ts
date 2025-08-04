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
    "classNames": z.optional(z.object({
        "container": z.optional(z.string()),
        "table": z.optional(z.object({
            "table": z.optional(z.string()),
            "tableHead": z.object({
                "tableHead": z.optional(z.string()),
                "tableRow": z.optional(z.string()),
                "tableCell": z.optional(z.string()),
            }),
            "tableBody": z.object({
                "tableBody": z.optional(z.string()),
                "tableRow": z.optional(z.string()),
                "tableCell": z.optional(z.string()),
            }),
            "placeholder": z.optional(z.string())
        })),
        "footerContainer": z.optional(z.string()),
        "pagination": z.optional(z.object({
            "container": z.optional(z.string()),
            "button": z.optional(z.object({
                "base": z.optional(z.string()),
                "active": z.optional(z.string()),
                "ellipsis": z.optional(z.string()),
                "previous": z.optional(z.string()),
                "next": z.optional(z.string()),
            })),
            "sizeSelector": z.object({
                "container": z.optional(z.string()),
                "select": z.optional(z.string()),
                "option": z.optional(z.string()),
            }),
        })),
    })),
    "placeholderHTML": z._default(z.string(), "No data available.."),
    "pagination": z.optional(z.object({
        "active": z._default(z.boolean(), false),
        "pageSize": z._default(z.number(), 30),
        "availableSizes": z._default(z.array(z.number()), [10, 30, 50, 100]),
        "style": z._default(z.enum(["standard", "simple"]), "standard"),
        "elements": z.optional(z.object({
            "previousButtonHTML": z.optional(z.string()),
            "nextButtonHTML": z.optional(z.string()),
            "ellipsisHTML": z.optional(z.string()),
        })),
    }))
});

export type ConfigSchema = z.infer<typeof configSchema>;
