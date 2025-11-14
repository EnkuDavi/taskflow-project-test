import { PaginationQueryDto } from "./pagination";

interface PaginateSearchOption {
  fields: string[];
}

interface PaginateOptions<ModelWhere, ModelOrderBy> {
  where?: ModelWhere;
  orderBy?: ModelOrderBy;
  search?: PaginateSearchOption;
}

export async function paginate<Model>(
  prismaDelegate: {
    findMany: (args: any) => Promise<Model[]>;
    count: (args: any) => Promise<number>;
  },
  query: PaginationQueryDto,
  options: PaginateOptions<any, any> = {}
) {
  const page = query.page && query.page > 0 ? query.page : 1;
  const limit = query.limit && query.limit > 0 ? query.limit : 10;
  const skip = (page - 1) * limit;

  const where: any = { ...(options.where || {}) };
  const orderBy = options.orderBy || { createdAt: "desc" };

  if (query.search && options.search?.fields.length) {
    const search = query.search;

    where.OR = options.search.fields.map((field) => ({
      [field]: { contains: search, mode: "insensitive" },
    }));
  }

  const [items, total] = await Promise.all([
    prismaDelegate.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),

    prismaDelegate.count({ where }),
  ]);

  return {
    success: true,
    message: "Request successful",
    data: items,
    meta: {
      total,
      currentPage: page,
      lastPage: Math.ceil(total / limit),
      limit,
    },
  };
}
