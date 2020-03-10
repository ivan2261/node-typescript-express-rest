import { Model, Document, Types } from 'mongoose';
import { PageData } from '../common/pageData';

/**
 * @class BaseService
 */
export abstract class BaseService<T> {

    abstract Repository: Model<T & Document>;

    /**
     * @description find by conditions
     * @param {any} conditions
     * @param {any} projection
     * @param {any} options
     * @returns {Promise<T[]>}
     */
    async find(conditions: any, projection?: any, options?: any): Promise<T[]> {
        return await this.Repository.find(conditions, projection, options).lean() as T[];
    }

    /**
     * @description find by conditions
     * @param {any} conditions
     * @param {any} projection
     * @param {any} options
     * @returns {Promise<T>}
     */
    async findOne(conditions: any, projection?: any, options?: any): Promise<T> {
        return await this.Repository.findOne(conditions, projection, options).lean();
    }

    /**
     * @description Fetches all docs from the storage
     * @param {any} projection
     * @returns {Promise<T[]>}
     */
    async findAll(projection?: any): Promise<T[]> {
        return await this.Repository.find({}, projection).lean() as T[];
    }

    /**
     * @description Fetches multiple docs from the storage by page
     * @param {any} conditions
     * @param {number} page
     * @param {number} pageSize
     * @param {any} projection
     * @returns {Promise<PageData<T>>}
     */
    async findByPage(conditions: any, page: number, pageSize: number, projection?: any): Promise<PageData<T>> {
        const pageData = new PageData<T>(page, pageSize);
        pageData.total = await this.Repository.count(conditions);
        pageData.dataList = await this.Repository.find(conditions, projection).limit(pageSize).skip((page - 1) * pageSize).lean() as T[];
        pageData.hasMore = pageData.total - (page - 1) * pageSize > pageSize ? true : false;
        return pageData;
    }

    /**
     * @description Fetches multiple docs from the storage by page
     * @param {any[]} aggregations
     * @param {number} page
     * @param {number} pageSize
     * @returns {Promise<PageData<T>>}
     */
    async aggregateByPage(aggregations: any[], page: number, pageSize: number): Promise<PageData<T>> {
        const pageData = new PageData<T>(page, pageSize);
        pageData.total = await this.Repository.count(aggregations[0].$match || {});
        // aggregate
        aggregations.push({ $skip: pageSize * (page - 1) });
        aggregations.push({ $limit: pageSize });
        pageData.dataList = await this.Repository.aggregate(aggregations) as T[];

        pageData.hasMore = pageData.total - (page - 1) * pageSize > pageSize ? true : false;
        return pageData;
    }

    /**
     * @description Fetches single doc from the storage by id
     * @param {string} id ObjectId/custom id
     * @param {any} projection
     * @returns {Promise<T>}
     */
    async findById(id: string, projection?: any): Promise<T> {
        const conditions = {};
        conditions[this.Repository.modelName.toLowerCase() + 'Id'] = id;

        let res: T & Document;
        if (!Types.ObjectId.isValid(id)) {
            res = await this.Repository.findOne(conditions, projection).lean();
        } else {
            res = await this.Repository.findOne({ $or: [{ _id: id }, conditions] }, projection).lean();
        }
        return res;
    }

    /**
     * @description Saves the doc in the storage
     * @param {T} doc
     * @returns {Promise<T>}
     */
    async save(doc: T): Promise<T> {
        return (await new this.Repository(doc).save()).toObject({ virtuals: true });
    }

    /**
     * @description Fetches single doc by conditions and sets values
     * @param {T} doc
     * @returns {Promise<T>}
     */
    async findOneAndUpdate(doc: T): Promise<T> {
        const conditions = {};
        if ((doc as any)._id) {
            conditions['_id'] = (doc as any)._id;
        } else {
            const fieldName = this.Repository.modelName.toLowerCase() + 'Id';
            conditions[fieldName] = (doc as any)[fieldName];
        }

        return await this.Repository.findOneAndUpdate(conditions, doc, { new: true }).lean();
    }

    /**
     * @description Deletes a single doc from storage
     * @param {string} id ObjectId/custom id
     * @returns {Promise<object>}
     */
    async deleteOne(id: string): Promise<object> {
        const conditions = {};
        conditions[this.Repository.modelName.toLowerCase() + 'Id'] = id;

        if (!Types.ObjectId.isValid(id)) {
            return await this.Repository.deleteOne(conditions);
        } else {
            return await this.Repository.deleteOne({ $or: [{ _id: id }, conditions] });
        }
    }
}