import { z } from "zod/mini";
export declare const responseSchema: z.ZodMiniObject<{
    data: z.ZodMiniArray<z.ZodMiniArray<z.ZodMiniObject<{
        column: z.ZodMiniString<string>;
        className: z.ZodMiniOptional<z.ZodMiniString<string>>;
        value: z.ZodMiniString<string>;
    }, z.core.$strip>>>;
    pagination: z.ZodMiniOptional<z.ZodMiniObject<{
        page: z.ZodMiniNumber<number>;
        pageSize: z.ZodMiniNumber<number>;
        totalPages: z.ZodMiniNumber<number>;
    }, z.core.$strip>>;
    totalRecords: z.ZodMiniNumber<number>;
}, z.core.$strip>;
export type ResponseSchema = z.infer<typeof responseSchema>;
