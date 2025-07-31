import { ColumnSchema } from "../schema/column";

export interface Sort {
    column: ColumnSchema,
    direction: "ASC" | "DESC"
}
