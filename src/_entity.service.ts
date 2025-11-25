import {
	DeepPartial,
	EntityManager,
	FindManyOptions,
	FindOneOptions,
	ObjectLiteral,
	Repository,
} from "typeorm";

import { AppDataSource } from "@/configs/orm-config";

export function EntityService<TEntity extends ObjectLiteral>(
	entity: new () => TEntity,
) {
	return class {
		static getRepo(
			manager?: EntityManager | null | undefined,
		): Repository<TEntity> {
			return manager
				? manager.getRepository(entity)
				: AppDataSource.getRepository(entity);
		}

		static async findById(
			id: number,
			manager?: EntityManager,
		): Promise<TEntity> {
			const repo = this.getRepo(manager);
			const entityFound = await repo.findOne({
				where: { id: Number(id) } as any,
			});
			if (!entityFound) throw new Error(`${entity.name} not found`);
			return entityFound;
		}

		static async findOne(
			filter: FindOneOptions<TEntity>,
			manager?: EntityManager,
		): Promise<TEntity | null> {
			const repo = this.getRepo(manager);
			return await repo.findOne(filter);
		}

		static async findAll(
			filter: FindManyOptions<TEntity>,
			manager?: EntityManager,
		): Promise<TEntity[]> {
			const repo = this.getRepo(manager);
			return await repo.find(filter);
		}

		static async create(
			data: DeepPartial<TEntity>,
			manager?: EntityManager,
		): Promise<TEntity> {
			const repo = this.getRepo(manager);
			return await repo.save(repo.create(data));
		}

		static async update(
			id: number,
			data: DeepPartial<TEntity>,
			manager?: EntityManager,
		): Promise<TEntity> {
			const existing = await this.findById(id, manager);
			const repo = this.getRepo(manager);
			const updated = repo.merge(existing, data);
			return await repo.save(updated);
		}

		static async delete(
			id: number,
			manager?: EntityManager,
		): Promise<void> {
			const existing = await this.findById(id, manager);
			const repo = this.getRepo(manager);
			await repo.remove(existing);
		}

		static async exists(
			filter: FindOneOptions<TEntity>,
			manager?: EntityManager,
		): Promise<boolean> {
			const repo = this.getRepo(manager);
			const found = await repo.findOne(filter);
			return !!found;
		}
	};
}
