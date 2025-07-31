import { z } from "zod";

export const responseSchema = z.object({
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
