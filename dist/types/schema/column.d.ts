import { z } from "zod/mini";
export declare const columnSchema: z.ZodMiniObject<{
    type: z.ZodMiniEnum<{
        text: "text";
        html: "html";
    }>;
    label: z.ZodMiniString<string>;
    className: z.ZodMiniOptional<z.ZodMiniString<string>>;
    filterable: z.ZodMiniBoolean<boolean>;
    searchable: z.ZodMiniBoolean<boolean>;
    sortable: z.ZodMiniBoolean<boolean>;
}, z.core.$strip>;
export type ColumnSchema = z.infer<typeof columnSchema>;
