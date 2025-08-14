import { z } from "zod/mini";

export const responseSchema = z.object({
    "total": z.number(),
    "totalFiltered": z.number(),
    "pagination": z.object({
        "page": z.number(),
        "pageSize": z.number(),
        "totalPages": z.number(),
    }),
    "data": z.array(
        z.array(
            z.object({
                "column": z.string(),
                "className": z.optional(z.string()),
                "value": z.string()
            })
        )
    ),
});

export type ResponseSchema = z.infer<typeof responseSchema>;
