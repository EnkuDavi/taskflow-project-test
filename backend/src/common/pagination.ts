import { t, Static } from "elysia";

export const paginationQuerySchema = t.Object({
  page: t.Optional(t.Numeric()),
  limit: t.Optional(t.Numeric()),
  search: t.Optional(t.String()),
});

export const paginationMetaSchema = t.Object({
  total: t.Number(),
  currentPage: t.Number(),
  lastPage: t.Number(),
  limit: t.Number(),
});

export type PaginationQueryDto = Static<typeof paginationQuerySchema>;
