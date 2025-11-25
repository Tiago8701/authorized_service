import { config } from "dotenv";
import {
	FindManyOptions,
	FindOptionsWhere,
	ILike,
	Like,
	ObjectLiteral,
	Repository,
} from "typeorm";

interface PaginatedResult<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	searchTerm?: string;
	nextPage?: string | null;
	prevPage?: string | null;
	totalPages: number;
}

config();

type SearchOptions<T> = {
	term?: string;
	fields?: (keyof T)[];
	caseInsensitive?: boolean;
};

const buildPageUrl = (
	pageNumber: number,
	safeLimit: number,
	hasSearch: boolean,
	term: string,
	route: string,
) => {
	const base =
		process.env.BASE_URL && process.env.BASE_URL.trim().length > 0
			? process.env.BASE_URL.trim()
			: "";
	const params = new URLSearchParams({
		page: String(pageNumber),
		limit: String(safeLimit),
	});
	if (hasSearch) params.set("search", term);
	return `${base}${route}?${params.toString()}`;
};

export default class PaginationService {
	public static async paginate<T extends ObjectLiteral>(
		repo: Repository<T>,
		findOptions: FindManyOptions<T> = {},
		page = 1,
		limit = 20,
		route: string,
		search?: SearchOptions<T>,
	): Promise<PaginatedResult<T>> {
		const safePage = Math.max(
			1,
			Number.isFinite(page) ? Math.floor(page) : 1,
		);
		const safeLimit = Math.min(
			500,
			Math.max(1, Number.isFinite(limit) ? Math.floor(limit) : 20),
		);

		const skip = (safePage - 1) * safeLimit;

		const term = (search?.term ?? "").trim();
		const hasSearch = term.length > 0;

		const searchFields = (
			search?.fields?.length ? search.fields : (["name"] as (keyof T)[])
		) as (keyof T)[];

		const op = (search?.caseInsensitive ?? true) ? ILike : Like;
		const pattern = `%${term}%`;

		const baseWhere = (() => {
			if (!findOptions.where)
				return [undefined as unknown as FindOptionsWhere<T>];
			return Array.isArray(findOptions.where)
				? (findOptions.where as FindOptionsWhere<T>[])
				: [findOptions.where as FindOptionsWhere<T>];
		})();

		let where: FindOptionsWhere<T>[] | FindOptionsWhere<T> | undefined =
			baseWhere;

		if (hasSearch && searchFields.length > 0) {
			where = baseWhere.map((w) => {
				const orBlocks = searchFields.map((field) => ({
					...(w as object),
					[field]: op(pattern) as unknown,
				})) as FindOptionsWhere<T>[];
				return orBlocks as unknown as FindOptionsWhere<T>;
			});
			where = (where as FindOptionsWhere<T>[]).flat() as unknown as
				| FindOptionsWhere<T>[]
				| FindOptionsWhere<T>;
		}

		const [data, total] = await repo.findAndCount({
			...findOptions,
			where,
			skip,
			take: safeLimit,
		});

		const totalPages = Math.max(1, Math.ceil(total / safeLimit));

		return {
			data,
			total,
			page: safePage,
			limit: safeLimit,
			searchTerm: hasSearch ? term : undefined,
			nextPage:
				safePage < totalPages
					? buildPageUrl(
							safePage + 1,
							safeLimit,
							hasSearch,
							term,
							route,
						)
					: null,
			prevPage:
				safePage > 1
					? buildPageUrl(
							safePage - 1,
							safeLimit,
							hasSearch,
							term,
							route,
						)
					: null,
			totalPages,
		};
	}

	public static async customPaginate<T extends ObjectLiteral>(
		data: T[],
		total: number,
		page: number,
		limit: number,
		route: string,
		term?: string,
	) {
		const safePage = Math.max(
			1,
			Number.isFinite(page) ? Math.floor(page) : 1,
		);
		const safeLimit = Math.min(
			500,
			Math.max(1, Number.isFinite(limit) ? Math.floor(limit) : 20),
		);

		const totalPages = Math.max(1, Math.ceil(total / safeLimit));
		const searchTerm = (term ?? "").trim();
		const hasSearch = searchTerm.length > 0;

		return {
			data,
			total,
			page: safePage,
			limit: safeLimit,
			searchTerm: hasSearch ? searchTerm : undefined,
			nextPage:
				safePage < totalPages
					? buildPageUrl(
							safePage + 1,
							safeLimit,
							hasSearch,
							searchTerm,
							route,
						)
					: null,
			prevPage:
				safePage > 1
					? buildPageUrl(
							safePage - 1,
							safeLimit,
							hasSearch,
							searchTerm,
							route,
						)
					: null,
			totalPages,
		};
	}
}
