import { z } from "zod";
import { columnSchema } from "./column";

export const configSchema = z.object({
    "ajaxURL": z.string(),
    "debug": z.boolean().optional().default(false),
    "columns": z.array(columnSchema),
    "classNames": z.object({
        "table": z.object({
            "table": z.string().optional(),
            "body": z.string().optional(),
            "placeholder": z.string().optional()
        }).optional(),
    }).optional(),
    "placeholder": z.string().optional().default("No data available.."),
    "pagination": z.object({
        "enabled": z.boolean().optional().default(false),
        "style": z.enum(["standard", "simple"]).optional().default("standard"),
    })
});

export type ConfigSchema = z.infer<typeof configSchema>;
