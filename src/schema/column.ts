import { z } from "zod";

export const columnSchema = z.object({
    "name": z.string(),
    "type": z.string(),
    "label": z.string(),
    "className": z.string().optional(),
    "sortable": z.boolean(),
    "searchable": z.boolean(),
    "visible": z.boolean(),
});

export type ColumnSchema = z.infer<typeof columnSchema>;
