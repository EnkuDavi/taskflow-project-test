import { t, Static } from 'elysia'

export const paginationQuerySchema = t.Object({
  page: t.Optional(t.Numeric()),
  limit: t.Optional(t.Numeric()),
  search: t.Optional(t.String())
})

export type PaginationQueryDto = Static<typeof paginationQuerySchema>
