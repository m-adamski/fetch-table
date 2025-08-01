import { z } from "zod";
import { columnSchema } from "./column";

export const configSchema = z.object({
    "ajaxURL": z.string(),
    "debug": z.boolean().optional().default(false),
    "columns": z.array(columnSchema),
    "classNames": z.object({
        "container": z.string().optional(),
        "table": z.object({
            "table": z.string().optional(),
            "head": z.object({
                "container": z.string().optional(),
                "row": z.string().optional(),
                "cell": z.string().optional(),
            }),
            "body": z.object({
                "container": z.string().optional(),
                "row": z.string().optional(),
                "cell": z.string().optional(),
            }),
            "placeholder": z.string().optional()
        }).optional(),
        "footer": z.string().optional(),
        "pagination": z.object({
            "container": z.string().optional(),
            "button": z.object({
                "base": z.string().optional(),
                "active": z.string().optional(),
                "ellipsis": z.string().optional(),
                "previous": z.string().optional(),
                "next": z.string().optional(),
            }).optional(),
            "sizeSelector": z.object({
                "container": z.string().optional(),
                "select": z.string().optional(),
                "option": z.string().optional(),
            }).optional()
        }).optional()
    }).optional(),
    "placeholder": z.string().optional().default("No data available.."),
    "pagination": z.object({
        "active": z.boolean().optional().default(false),
        "pageSize": z.number().optional().default(20),
        "availableSizes": z.array(z.number()).optional().default([10, 20, 30, 50, 100]),
        "style": z.enum(["standard", "simple"]).optional().default("standard"),
        "elements": z.object({
            "previousButton": z.string().optional(),
            "nextButton": z.string().optional(),
            "ellipsis": z.string().optional(),
        }).optional(),
    }).optional()
});

export type ConfigSchema = z.infer<typeof configSchema>;
