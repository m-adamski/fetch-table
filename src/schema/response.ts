import { z } from "zod/mini";

export const responseSchema = z.object({
    "data": z.array(
        z.array(
            z.object({
                "column": z.string(),
                "className": z.optional(z.string()),
                "value": z.string()
            })
        )
    ),
    "pagination": z.optional(z.object({
        "page": z.number(),
        "pageSize": z.number(),
        "totalPages": z.number(),
    })),
    "totalRecords": z.number()
});

export type ResponseSchema = z.infer<typeof responseSchema>;
