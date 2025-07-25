import { z } from "zod";

export const configSchema = z.object({
    "ajaxURL": z.string()
});

export type ConfigSchema = z.infer<typeof configSchema>;
