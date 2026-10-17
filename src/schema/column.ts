import { z } from "zod/mini";

export const columnSchema = z.object({
    "type": z.enum(["text", "html"]),
    "label": z.string(),
    "className": z.optional(z.string()),
    "filterable": z.boolean(),
    "searchable": z.boolean(),
    "sortable": z.boolean(),
});

export type ColumnSchema = z.infer<typeof columnSchema>;
