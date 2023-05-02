import {
    ClientSession, FilterQuery, Model, PipelineStage, Schema, SchemaDefinition, SchemaOptions, model
} from 'mongoose'
import { DataOrError } from '../types/dataOrError'
import { ApiError } from '../utils/ApiError'

interface SortOptions {
    [key: string]: 1 | -1
}

interface QueryOptions {
    limit?: number
    skip?: number
    sort?: SortOptions | string
    projection?: { [key: string]: number }
    session: ClientSession
}

interface UpdateOptions {
    upsert?: boolean
    multi?: boolean
    new?: boolean
    session?: ClientSession
}

export type ModelAPI<T> = T & {
    _id: string
    active: boolean
    deletedAt: number
    deletedBy: string
    toJSON(): T
}

interface CreateModelOptions<T, ModelClient> {
    name: string
    schema: SchemaDefinition
    options?: SchemaOptions
    /**
     * preSave is called before the document is saved in the database.
     * The document is not save if preSave returns an error.
     */
    preSave?: (document: T) => Promise<DataOrError<T>>

    /**
     * toJson is called before the document is sent to the client side (objects are stringified over the network).
     * toJson is called recursively on sub documents.
     */
    toJSON: (o: T) => ModelClient
}

export class BaseModel<T extends ModelAPI<{}>, ModelClient> {
    schema: Schema
    modelName: string
    model: Model<T>

    constructor(options: CreateModelOptions<T, ModelClient>) {
        this.modelName = options.name
        this.schema = this.createSchema(options.schema)
        this.schema.set('toJSON', {
            transform: (doc: T) => options.toJSON(doc),
        })
        if (options.preSave) {
            this.schema.pre('save', async function (this: T) {
                const result = await options.preSave?.(this)
                if (result?.error) {
                    throw result.error
                }
            })
        }
    
        this.model = model<T>(this.modelName, this.schema)

    }

    private createSchema(schema: SchemaDefinition): Schema {
        return new Schema(
            {
                ...schema,
                active: { type: Boolean, default: true, index: true },
            },
            {
                timestamps: {
                    createdAt: 'created',
                    updatedAt: 'updated'
                }
            }
        )
    }

    async create(data: Partial<T>): Promise<DataOrError<T>> {
        try {
            const doc = new this.model(data)
            return {
                data: doc,
            }
        } catch (error) {
            return {
                error: new ApiError('Error creating document', 400, (error as Error))
            }
        }
    }
    
    async createAndSave(data: Partial<T>): Promise<DataOrError<T>> {
        try {
            const doc = await this.model.create(data)
            return {
                data: doc,
            }
        } catch (error) {
            return {
                error: new ApiError('Error creating and saving document', 400, (error as Error))
            }
        }
    }

    async find(
        query: FindQuery<Partial<T>>,
        options?: QueryOptions,
    ): Promise<DataOrError<T[]>> {
        try {
            let docs = this.model.find(query, options?.projection)
            if (options?.limit) {
                docs = docs.limit(options.limit)
            }
            if (options?.skip) {
                docs = docs.skip(options.skip)
            }
            if (options?.sort) {
                docs = docs.sort(options.sort)
            }
            if (options?.session) {
                docs = docs.session(options.session)
            }
            const data = await docs.exec()
            return {
                data,
            }
        } catch (error) {
            return {
                error: new ApiError('Error finding documents', 400, (error as Error))
            }
        }
    }

    async findOne(
        query: FindQuery<Partial<T>>,
        options?: QueryOptions
    ): Promise<DataOrError<T | null>> {
        try {
            let doc = this.model.findOne(query, options?.projection)
            if (options?.limit) {
                doc = doc.limit(options.limit)
            }
            if (options?.skip) {
                doc = doc.skip(options.skip)
            }
            if (options?.sort) {
                doc = doc.sort(options.sort)
            }
            if (options?.session) {
                doc = doc.session(options.session)
            }
            const data = await doc.exec()
            return {
                data,
            }
        } catch (error) {
            return {
                error: new ApiError('Error finding document', 400, (error as Error))
            }
        }
    }

    async findById(
        id: string,
        options?: QueryOptions
    ): Promise<DataOrError<T | null>> {
        try {
            let doc = this.model.findOne({ _id: id }, options?.projection)
            if (options?.limit) {
                doc = doc.limit(options.limit)
            }
            if (options?.skip) {
                doc = doc.skip(options.skip)
            }
            if (options?.sort) {
                doc = doc.sort(options.sort)
            }
            if (options?.session) {
                doc = doc.session(options.session)
            }
            const data = await doc.exec()
            return {
                data,
            }
        } catch (error) {
            return {
                error: new ApiError('Error finding document', 400, (error as Error))
            }
        }
    }

    async updateOne(
        query: FindQuery<T>,
        update: UpdateManyUpdate<T>,
        options?: UpdateOptions
    ): Promise<DataOrError<T | null>> {
        try {
            const doc = await this.model.findOneAndUpdate(query, update, options)
            return {
                data: doc,
            }
        } catch (error) {
            return {
                error: new ApiError('Error updating document', 400, (error as Error))
            }
        }
    }

    async updateMany(
        query: FindQuery<T>,
        update: UpdateManyUpdate<T>,
        options?: UpdateOptions
    ) {
        try {
            const docs = await this.model.updateMany(query, update, options)
            return {
                data: docs,
            }
        } catch (error) {
            return {
                error: new ApiError('Error updating documents', 400, (error as Error))
            }
        }
    }

    async deleteOne(
        query: FindQuery<T>,
        options: QueryOptions
    ): Promise<DataOrError<T | null>> {
        try {
            const doc = await this.model.findOneAndDelete(query, options)
            
            return {
                data: doc,
            }
        } catch (error) {
            return {
                error: new ApiError('Error deleting document', 400, (error as Error))
            }
        }
    }

    async deleteMany(
        query: FindQuery<T>,
        options: Omit<Omit<QueryOptions, 'projection'>, 'sort'>
    ) {
        try {
            const docs = await this.model.deleteMany(query, options)
            return {
                data: docs,
            }
        } catch (error) {
            return {
                error: new ApiError('Error deleting documents', 400, (error as Error))
            }
        }
    }

    async count(
        query: FindQuery<T>,
        options: QueryOptions
    ) {
        try {
            const count = await this.model.countDocuments(query, options)
            return {
                data: count,
            }
        } catch (error) {
            return {
                error: new ApiError('Error counting documents', 400, (error as Error))
            }
        }
    }

    async aggregate(
        pipeline: PipelineStage[]
    ) {
        try {
            const data = await this.model.aggregate(pipeline)
            return {
                data,
            }
        } catch (error) {
            return {
                error: new ApiError('Error aggregating documents', 400, (error as Error))
            }
        }
    }
}

type Query<T> = FilterQuery<T>
type FindQuery<T> = Query<T> & {}

export type UpdateManyUpdate<T = { [key: string]: any }> = {
    $set?: Partial<T>
    $push?: Partial<T>
    $inc?: Partial<T>
    $max: Partial<T>
}