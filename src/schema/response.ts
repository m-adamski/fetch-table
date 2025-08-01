import { z } from "zod";

export const responseSchema = z.object({
    "total": z.number(),
    "total_filtered": z.number(),
    "pagination": z.object({
        "page": z.number(),
        "page_size": z.number(),
        "total_pages": z.number(),
    }),
    "data": z.array(
        z.array(
            z.object({
                "column": z.string(),
                "className": z.string().optional(),
                "value": z.string()
            })
        )
    ),
});

export type ResponseSchema = z.infer<typeof responseSchema>;
