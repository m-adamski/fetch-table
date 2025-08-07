import { z } from "zod/mini";

export const columnSchema = z.object({
    "name": z.string(),
    "type": z.enum(["text", "html"]),
    "label": z.string(),
    "className": z.optional(z.string()),
    "sortable": z.boolean(),
    "searchable": z.boolean(),
});

export type ColumnSchema = z.infer<typeof columnSchema>;
