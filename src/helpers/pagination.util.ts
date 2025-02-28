import { PaginationResponse } from '@/base/dto/pagination.response';
import aqp from 'api-query-params';
import {
  FindOptionsOrder,
  FindOptionsWhere,
  ObjectId,
  Repository,
} from 'typeorm';

export async function paginate<T>(
  repository: Repository<T>,
  query: string,
): Promise<
  PaginationResponse & {
    data: T[];
  }
> {
  const { filter, sort, limit = 10, skip = 0 } = aqp(query);

  // ✅ Convert filters to use ILIKE for search fields
  const where: FindOptionsWhere<T> = Object.keys(filter || {}).reduce(
    (acc, key) => {
      if (key === '_id') {
        acc[key] = new ObjectId(filter[key]); // ✅ Fix MongoDB ID Filtering
        } else if (typeof filter[key] === 'string') {
        acc[key] = { $regex: new RegExp(filter[key]), $options: 'i' }; // ✅ Use LIKE for MongoDB
      } else {
        acc[key] = filter[key];
      }
      return acc;
    },
    {} as FindOptionsWhere<T>,
  );

  // ✅ Convert sort order to TypeORM's expected format
  const order: FindOptionsOrder<T> = Object.keys(sort || {}).reduce(
    (acc, key) => {
      acc[key] = sort[key] === 1 ? 'ASC' : 'DESC';
      return acc;
    },
    {} as FindOptionsOrder<T>,
  );

  const [data, total] = await repository.findAndCount({
    where, // ✅ Ensure correct typing for where
    order, // ✅ Use converted order object
    take: limit,
    skip,
  });

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(skip / limit) + 1;

  return {
    data,
    total,
    limit,
    skip,
    currentPage,
    totalPages,
  };
}
