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
  const baseFilters: any[] = [];

  if (options.where) {
    Object.entries(options.where).forEach(([key, value]) => {
      baseFilters.push({ [key]: value });
    });
  }

  let searchFilters: any[] = [];
  if (query.search && options.search?.fields.length) {
    searchFilters = [
      {
        OR: options.search.fields.map((field) => ({
          [field]: { contains: query.search, mode: "insensitive" },
        })),
      },
    ];
  }

  const where =
    baseFilters.length || searchFilters.length
      ? { AND: [...baseFilters, ...searchFilters] }
      : {};

  const [items, total] = await Promise.all([
    prismaDelegate.findMany({
      where,
      orderBy: options.orderBy || { createdAt: "desc" },
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
